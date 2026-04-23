"use client";

import { useEffect, useMemo, useState } from "react";
import { Reorder } from "framer-motion";
import {
  BookOpen,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Inbox,
  LayoutGrid,
  LogOut,
  Monitor,
  Paintbrush,
  Plus,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useArticles, useContent, useEditor, usePageTemplates, usePages, useTheme } from "@/lib/editor/hooks";
import { useContentStore, useThemeStore } from "@/lib/editor/stores";
import { normalizePagesForStore, usePagesStore } from "@/lib/editor/pagesStore";
import { useArticlesStore } from "@/lib/editor/articlesStore";
import { useTemplatesStore } from "@/lib/editor/templatesStore";
import { usePageTemplatesStore } from "@/lib/editor/pageTemplatesStore";
import type { Article } from "@/lib/data";
import type { BlockTemplate } from "@/lib/editor/templatesStore";
import type { PageTemplate } from "@/lib/editor/pageTemplatesStore";
import type { SiteBlock, SiteContent, SitePage, ThemeSettings } from "@/lib/editor/types";
import { HomeCanvas } from "@/components/site/HomeCanvas";
import { PageCanvas } from "@/components/site/PageCanvas";
import { parseDisplayDate } from "@/lib/articles/date";
import { slugify } from "@/lib/editor/articlesStore";
import { BlockInspector } from "@/components/admin/BlockInspector";
import { DeviceFrame } from "@/components/admin/DeviceFrame";
import { useUndoStore } from "@/lib/editor/undoStore";
import { getDesignPresetTheme } from "@/lib/editor/designPresets";
import { MediaPanel } from "@/components/admin/MediaPanel";
import { UsersPanel } from "@/components/admin/UsersPanel";
import { PreviewChangesModal } from "@/components/admin/PreviewChangesModal";
import { LATEST_BLOCK_SCHEMA_VERSION } from "@/lib/editor/blockMigrations";

const ADMIN_USER_PLACEHOLDER = "admin";
const SESSION_KEY = "crc.admin.session.v1";
const DRAFT_APPLIED_AT_KEY = "crc.draft.appliedAt.v1";
const DRAFT_LOCAL_SNAPSHOT_KEY = "crc.draft.snapshot.v1";

type AdminRole = "admin" | "publisher" | "editor" | "viewer";
type Session = { user: string; role: AdminRole; expiresAt: number };

function collectMediaRefs(input: unknown) {
  const out = new Set<string>();
  const seen = new WeakSet<object>();
  const visit = (v: unknown) => {
    if (typeof v === "string") {
      if (v.startsWith("/uploads/")) out.add(v);
      return;
    }
    if (!v) return;
    if (Array.isArray(v)) {
      for (const it of v) visit(it);
      return;
    }
    if (typeof v === "object") {
      if (seen.has(v)) return;
      seen.add(v);
      for (const val of Object.values(v as Record<string, unknown>)) visit(val);
    }
  };
  visit(input);
  return [...out];
}

function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (!parsed?.user || !parsed?.expiresAt) return null;
    if (Date.now() > parsed.expiresAt) return null;
    const role: AdminRole =
      parsed.role === "admin" || parsed.role === "publisher" || parsed.role === "editor" || parsed.role === "viewer"
        ? parsed.role
        : "admin";
    return { user: parsed.user, role, expiresAt: parsed.expiresAt };
  } catch {
    return null;
  }
}

function saveSession(user: string, role: AdminRole) {
  const session: Session = {
    user,
    role,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 días
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

function blockTitle(type: SiteBlock["type"]) {
  switch (type) {
    case "legacy.hero":
      return "Hero (legacy)";
    case "legacy.founders":
      return "Directores (legacy)";
    case "legacy.servicesPreview":
      return "Servicios (legacy)";
    case "legacy.latestArticles":
      return "Lo más reciente (legacy)";
    case "legacy.publications":
      return "Publicaciones (legacy)";
    case "legacy.interviews":
      return "Multimedia (legacy)";
    case "legacy.testimonials":
      return "Opiniones (legacy)";
    case "hero":
      return "Hero";
    case "richText":
      return "Texto";
    case "features":
      return "Features";
    case "cta":
      return "CTA";
    case "pricing":
      return "Pricing";
    case "faq":
      return "FAQ";
    case "logos":
      return "Logos";
    case "spacer":
      return "Espaciador";
    case "embed":
      return "Embed";
    default:
      return type;
  }
}

function isBlockReorderable(block: SiteBlock) {
  return !block.locked && block.type !== "legacy.hero";
}

const HOME_BLOCK_ADD: { type: SiteBlock["type"]; label: string; preset?: SiteBlock["preset"] }[] = [
  { type: "legacy.founders", label: "Directores (legacy)", preset: "corporate" },
  { type: "legacy.servicesPreview", label: "Servicios (legacy)", preset: "premium" },
  { type: "legacy.latestArticles", label: "Lo más reciente (legacy)", preset: "minimal" },
  { type: "legacy.publications", label: "Publicaciones (legacy)", preset: "premium" },
  { type: "legacy.interviews", label: "Multimedia (legacy)", preset: "bold" },
  { type: "legacy.testimonials", label: "Opiniones (legacy)", preset: "bold" },
  { type: "hero", label: "Hero", preset: "premium" },
  { type: "features", label: "Features", preset: "corporate" },
  { type: "richText", label: "Texto", preset: "minimal" },
  { type: "cta", label: "CTA", preset: "bold" },
  { type: "faq", label: "FAQ", preset: "minimal" },
  { type: "pricing", label: "Pricing", preset: "premium" },
  { type: "logos", label: "Logos", preset: "corporate" },
  { type: "form", label: "Form", preset: "corporate" },
  { type: "embed", label: "Embed", preset: "minimal" },
  { type: "spacer", label: "Espaciador", preset: "minimal" },
];

type Tab = "site" | "content" | "style" | "media" | "people" | "articles" | "leads" | "access";

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState<Tab>("content");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishValidate, setPublishValidate] = useState(true);
  const [publishGit, setPublishGit] = useState(true);
  const [publishBusy, setPublishBusy] = useState(false);
  const [publishResult, setPublishResult] = useState<string | null>(null);
  const [publishBaseHash, setPublishBaseHash] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [publishedState, setPublishedState] = useState<null | { theme: unknown; content: unknown; pages: SitePage[]; articles: unknown }>(
    null
  );
  const [versionsBusy, setVersionsBusy] = useState(false);
  const [versions, setVersions] = useState<{ id: string; createdAt: number; message: string; user?: string }[]>([]);
  const [leadsBusy, setLeadsBusy] = useState(false);
  const [leads, setLeads] = useState<
    { id: string; createdAt: number; source: string; name: string; email: string; phone: string; message: string; page: string; formId?: string; fields?: Record<string, unknown> }[]
  >([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [opsResult, setOpsResult] = useState<string | null>(null);
  const [backupsBusy, setBackupsBusy] = useState(false);
  const [backups, setBackups] = useState<{ id: string; createdAt: number; name: string; user: string }[]>([]);
  const [backupResult, setBackupResult] = useState<string | null>(null);
  const [auditBusy, setAuditBusy] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [auditEntries, setAuditEntries] = useState<
    { id: string; at: number; user: string; role?: string; action: string; entity?: unknown; detail?: string }[]
  >([]);
  const [importOpen, setImportOpen] = useState(false);
  const [importCandidate, setImportCandidate] = useState<unknown>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [articlesKind, setArticlesKind] = useState<"columns" | "reviews">("columns");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [draftSaving, setDraftSaving] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState(0);
  const [draftServerHash, setDraftServerHash] = useState<string | null>(null);
  const [draftSaveError, setDraftSaveError] = useState<string | null>(null);
  const [draftRecoverOpen, setDraftRecoverOpen] = useState(false);
  const [draftRecoverMeta, setDraftRecoverMeta] = useState<null | { savedAt: number; savedBy: string; hash: string }>(null);

  const {
    setAdminEnabled,
    selectedTextPath,
    selectText,
    selectedPage,
    selectPage,
    device,
    setDevice,
    selectedBlockId,
    selectedBlockPageId,
  } = useEditor();

  const undo = useUndoStore((s) => s.undo);
  const redo = useUndoStore((s) => s.redo);
  const canUndo = useUndoStore((s) => s.past.length > 0);
  const canRedo = useUndoStore((s) => s.future.length > 0);
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
    get,
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

  const {
    pages,
    lastChangedAt: pagesChangedAt,
    addPage,
    duplicatePage,
    deletePage,
    updatePage,
    renameSlug: renamePageSlug,
    addGlobalSection,
    deleteGlobalSection,
    addBlock,
    insertBlock,
    duplicateBlock,
    deleteBlock,
    reorderBlocks,
    replaceBlocks,
    toggleBlockVisible,
    setBlockLocked,
    setBlockPreset,
    updateBlockStyle,
    insertGlobalRef,
    makeBlockGlobal,
    reset: resetPages,
  } = usePages();

  const {
    templates: pageTemplates,
    addPageTemplate,
    deletePageTemplate,
    renamePageTemplate,
    reset: resetPageTemplates,
  } = usePageTemplates();

  useEffect(() => {
    const sync = () => {
      const s = loadSession();
      setSession(s);
      setAdminEnabled(!!s && s.role !== "viewer");
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
    if (!session) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/admin/me", { cache: "no-store" });
        if (r.status === 401) {
          clearSession();
          window.dispatchEvent(new Event("crc-admin-session"));
          return;
        }
        const json = (await r.json()) as { ok?: boolean; user?: string; role?: AdminRole };
        if (!json.ok || !json.user) return;
        const role: AdminRole =
          json.role === "admin" || json.role === "publisher" || json.role === "editor" || json.role === "viewer" ? json.role : "viewer";
        const current = loadSession();
        if (!current) return;
        if (current.user !== json.user || current.role !== role) {
          saveSession(json.user, role);
          if (!cancelled) window.dispatchEvent(new Event("crc-admin-session"));
        }
      } catch {
        // ignore: keep local session
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  useEffect(() => {
    if (!session) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if (key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [session, undo, redo]);

  useEffect(() => {
    if (!session) return;
    if (session.role === "viewer") return;

    setDraftSavedAt((v) => (v ? v : Date.now()));
    setDraftSaveError(null);

    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/draft", { cache: "no-store" });
        const json = (await r.json()) as {
          ok?: boolean;
          draft?: { savedAt?: unknown; savedBy?: unknown; hash?: unknown } | null;
        };
        const d = json.ok ? json.draft : null;
        if (!d || typeof d !== "object") return;
        const savedAt = typeof d.savedAt === "number" ? d.savedAt : 0;
        const savedBy = typeof d.savedBy === "string" ? d.savedBy : "";
        const hash = typeof d.hash === "string" ? d.hash : "";
        if (!savedAt || !hash) return;
        if (!cancelled) setDraftServerHash(hash);

        const appliedAt =
          typeof window !== "undefined" ? Number(window.localStorage.getItem(DRAFT_APPLIED_AT_KEY) ?? 0) : 0;
        if (savedAt > appliedAt + 2000 && !cancelled) {
          setDraftRecoverMeta({ savedAt, savedBy, hash });
          setDraftRecoverOpen(true);
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session]);

  useEffect(() => {
    if (!session) return;
    if (session.role === "viewer") return;

    const tickMs = 7_000;
    const id = window.setInterval(async () => {
      const last = Math.max(themeChangedAt, contentChangedAt, articlesChangedAt, pagesChangedAt);
      if (!last) return;
      if (draftSaving) return;
      if (last <= draftSavedAt) return;

      setDraftSaving(true);
      setDraftSaveError(null);
      try {
        const dump = getDump();
        const r = await fetch("/api/draft", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ dump, baseHash: draftServerHash }),
        });
        const json = await r.json();
        if (!json.ok) {
          if (json.error === "conflict") {
            setDraftSaveError("Hay un borrador más reciente guardado en el servidor. Revisa “Recuperar borrador”.");
            if (typeof json.serverHash === "string") setDraftServerHash(json.serverHash);
          } else {
            setDraftSaveError(`No se pudo guardar: ${json.error || "save_failed"}`);
          }
          return;
        }
        const savedAt = typeof json.savedAt === "number" ? json.savedAt : Date.now();
        setDraftSavedAt(savedAt);
        if (typeof json.hash === "string") setDraftServerHash(json.hash);
        try {
          window.localStorage.setItem(
            DRAFT_LOCAL_SNAPSHOT_KEY,
            JSON.stringify({ savedAt, hash: typeof json.hash === "string" ? json.hash : "", dump }, null, 0)
          );
        } catch {
          // ignore
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
        setDraftSaveError(`No se pudo guardar: ${message}`);
      } finally {
        setDraftSaving(false);
      }
    }, tickMs);

    return () => window.clearInterval(id);
	  }, [
	    session,
	    themeChangedAt,
	    contentChangedAt,
	    articlesChangedAt,
	    pagesChangedAt,
	    draftSavedAt,
	    draftServerHash,
	    draftSaving,
	    getDump,
	  ]);

  useEffect(() => {
    if (!session) return;
    if (tab !== "leads") return;
    if (session.role === "viewer") return;
    let cancelled = false;
    (async () => {
      setLeadsBusy(true);
      try {
        const r = await fetch("/api/leads");
        const json = (await r.json()) as { ok?: boolean; leads?: unknown };
        if (!cancelled && json.ok && Array.isArray(json.leads)) {
          setLeads(json.leads as typeof leads);
        }
      } finally {
        if (!cancelled) setLeadsBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session, tab]);

  const homePage = useMemo(() => pages.find((p) => p.id === "home") ?? null, [pages]);
  const homeBlocks = homePage?.blocks ?? [];

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

  const role: AdminRole = session?.role ?? "viewer";
  const sessionUser = session?.user ?? "unknown";
  const canEdit = !!session && role !== "viewer";
  const canPublish = !!session && (role === "admin" || role === "publisher");
  const canManageUsers = !!session && role === "admin";
  const canReadLeads = !!session && (role === "admin" || role === "publisher" || role === "editor");
  const canUseAi = !!session && (role === "admin" || role === "publisher" || role === "editor");

  const lastDirtyAt = useMemo(() => Math.max(themeChangedAt, contentChangedAt, articlesChangedAt, pagesChangedAt), [
    themeChangedAt,
    contentChangedAt,
    articlesChangedAt,
    pagesChangedAt,
  ]);
  const isDirty = canEdit && lastDirtyAt > draftSavedAt;

  const saveState = useMemo(() => {
    if (!canEdit) return { label: "Solo lectura", tone: "muted" as const };
    if (draftSaving) return { label: "Guardando…", tone: "active" as const };
    if (draftSaveError) return { label: "No guardado", tone: "muted" as const };
    if (isDirty) return { label: "Cambios sin guardar", tone: "muted" as const };
    return { label: "Guardado", tone: "ok" as const };
  }, [canEdit, draftSaveError, draftSaving, isDirty]);

  type SiteDump = {
    version: number;
    exportedAt: number;
    exportedBy: string;
    schema?: { blockSchemaVersion: number };
    mediaRefs?: string[];
    theme: unknown;
    content: unknown;
    pages: unknown;
    articles: unknown;
    blockTemplates: unknown;
    pageTemplates: unknown;
  };

  function getDump(): SiteDump {
    const theme = structuredClone(useThemeStore.getState().theme);
    const content = structuredClone(useContentStore.getState().content);
    const pages = structuredClone(usePagesStore.getState().pages);
    const articles = {
      columns: structuredClone(useArticlesStore.getState().columns),
      reviews: structuredClone(useArticlesStore.getState().reviews),
    };
    const blockTemplates = structuredClone(useTemplatesStore.getState().blocks);
    const pageTemplates = structuredClone(usePageTemplatesStore.getState().templates);
    const mediaRefs = collectMediaRefs({ theme, content, pages, articles, blockTemplates, pageTemplates });
    return {
      version: 2,
      exportedAt: Date.now(),
      exportedBy: sessionUser,
      schema: { blockSchemaVersion: LATEST_BLOCK_SCHEMA_VERSION },
      mediaRefs,
      theme,
      content,
      pages,
      articles,
      blockTemplates,
      pageTemplates,
    };
  }

  const downloadJson = (filename: string, value: unknown) => {
    const blob = new Blob([JSON.stringify(value, null, 2) + "\n"], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const applyDump = (dump: Partial<SiteDump>) => {
    if (!dump) return;
    if (dump.theme) {
      useThemeStore.setState(
        { theme: structuredClone(dump.theme as unknown as ThemeSettings), lastChangedAt: Date.now() },
        false
      );
    }
    if (dump.content) {
      useContentStore.setState(
        { content: structuredClone(dump.content as unknown as SiteContent), lastChangedAt: Date.now() },
        false
      );
    }
    if (dump.pages) {
      usePagesStore.setState(
        { pages: normalizePagesForStore(structuredClone(dump.pages as unknown as SitePage[])), lastChangedAt: Date.now() },
        false
      );
    }
    if (dump.articles && typeof dump.articles === "object") {
      const a = dump.articles as unknown as { columns?: unknown; reviews?: unknown };
      useArticlesStore.setState(
        {
          columns: structuredClone((Array.isArray(a.columns) ? (a.columns as unknown as Article[]) : []) as Article[]),
          reviews: structuredClone((Array.isArray(a.reviews) ? (a.reviews as unknown as Article[]) : []) as Article[]),
          lastChangedAt: Date.now(),
        },
        false
      );
    }
    if (dump.blockTemplates) {
      useTemplatesStore.setState(
        { blocks: structuredClone(dump.blockTemplates as unknown as BlockTemplate[]) },
        false
      );
    }
    if (dump.pageTemplates) {
      usePageTemplatesStore.setState(
        { templates: structuredClone(dump.pageTemplates as unknown as PageTemplate[]) },
        false
      );
    }
    useUndoStore.getState().clear();
  };

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
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError(null);
                  setBusy(true);
                  const form = new FormData(e.currentTarget);
                  const user = String(form.get("user") ?? "");
                  const pass = String(form.get("pass") ?? "");
                  try {
                    const r = await fetch("/api/admin/login", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({ user, pass }),
                    });
                    const json = (await r.json()) as { ok?: boolean; error?: string; user?: string; role?: AdminRole; insecureDevMode?: boolean };
                    if (!json.ok) {
                      setError("Usuario o contraseña incorrectos.");
                      return;
                    }
                    const role: AdminRole =
                      json.role === "admin" || json.role === "publisher" || json.role === "editor" || json.role === "viewer"
                        ? json.role
                        : "admin";
                    saveSession(String(json.user ?? user), role);
                    window.dispatchEvent(new Event("crc-admin-session"));
                  } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
                    setError(`Error: ${message}`);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <label className="block text-xs font-semibold text-white/70">Usuario</label>
                <input
                  name="user"
                  autoComplete="username"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none ring-1 ring-transparent focus:ring-cyan-300/30"
                  placeholder={ADMIN_USER_PLACEHOLDER}
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

          <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
            <span className="truncate max-w-32">{session.user}</span>
            <span className="text-white/40">·</span>
            <span className="uppercase tracking-wide text-[11px]">{role}</span>
          </div>

          <div className="hidden lg:inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              className={cn(
                "rounded-full px-3 py-2 text-xs font-semibold transition",
                canUndo ? "text-white/80 hover:bg-white/10" : "text-white/40"
              )}
              onClick={() => undo()}
              disabled={!canUndo}
              title="Undo (Cmd/Ctrl+Z)"
            >
              Undo
            </button>
            <button
              type="button"
              className={cn(
                "rounded-full px-3 py-2 text-xs font-semibold transition",
                canRedo ? "text-white/80 hover:bg-white/10" : "text-white/40"
              )}
              onClick={() => redo()}
              disabled={!canRedo}
              title="Redo (Cmd/Ctrl+Shift+Z)"
            >
              Redo
            </button>
          </div>

          <div className="hidden lg:inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              className={cn(
                "rounded-full px-3 py-2 text-xs font-semibold transition inline-flex items-center gap-2",
                device === "desktop" ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/10"
              )}
              onClick={() => setDevice("desktop")}
            >
              <Monitor className="h-4 w-4" />
              Desktop
            </button>
            <button
              type="button"
              className={cn(
                "rounded-full px-3 py-2 text-xs font-semibold transition inline-flex items-center gap-2",
                device === "tablet" ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/10"
              )}
              onClick={() => setDevice("tablet")}
            >
              <Tablet className="h-4 w-4" />
              Tablet
            </button>
            <button
              type="button"
              className={cn(
                "rounded-full px-3 py-2 text-xs font-semibold transition inline-flex items-center gap-2",
                device === "mobile" ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/10"
              )}
              onClick={() => setDevice("mobile")}
            >
              <Smartphone className="h-4 w-4" />
              Mobile
            </button>
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
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
            onClick={() => window.open(`/admin/preview?pageId=${encodeURIComponent(selectedPage)}`, "_blank", "noopener,noreferrer")}
          >
            Preview borrador
          </button>

          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
            onClick={async () => {
              setPreviewOpen(true);
              setPreviewBusy(true);
              setPreviewError(null);
              try {
                const r = await fetch("/api/published", { cache: "no-store" });
                const json = (await r.json()) as { ok?: boolean; state?: unknown; error?: string };
                if (!json.ok) throw new Error(json.error || "fetch_failed");
                const state = json.state && typeof json.state === "object" ? (json.state as Record<string, unknown>) : {};
                const publishedPages = Array.isArray(state.pages) ? (state.pages as SitePage[]) : [];
                setPublishedState({
                  theme: state.theme ?? {},
                  content: state.content ?? {},
                  pages: publishedPages,
                  articles: state.articles ?? {},
                });
              } catch (e: unknown) {
                const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
                setPreviewError(message);
                setPublishedState(null);
              } finally {
                setPreviewBusy(false);
              }
            }}
          >
            Preview cambios
          </button>

          <button
            type="button"
            className={cn(
              "rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-100 hover:bg-cyan-500/15 transition",
              !canPublish && "opacity-60 cursor-not-allowed"
            )}
            disabled={!canPublish}
            onClick={async () => {
              if (!canPublish) return;
              setPublishResult(null);
              setPublishBaseHash(null);
              setPublishOpen(true);
              try {
                const r = await fetch("/api/published", { cache: "no-store" });
                const json = (await r.json()) as { ok?: boolean; hash?: string; error?: string };
                if (json.ok && typeof json.hash === "string") setPublishBaseHash(json.hash);
              } catch {
                // ignore
              }
            }}
          >
            Publicar cambios
          </button>

          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
            onClick={async () => {
              try {
                await fetch("/api/admin/logout", { method: "POST" });
              } catch {
                // ignore
              }
              clearSession();
              window.dispatchEvent(new Event("crc-admin-session"));
            }}
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </div>

      {draftRecoverOpen && draftRecoverMeta ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">Recuperar borrador</div>
                <div className="mt-1 text-xs text-white/60">
                  Hay un borrador guardado el {new Date(draftRecoverMeta.savedAt).toLocaleString()}
                  {draftRecoverMeta.savedBy ? ` por ${draftRecoverMeta.savedBy}.` : "."}
                </div>
              </div>
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                onClick={() => setDraftRecoverOpen(false)}
                disabled={draftSaving}
              >
                Cerrar
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70">
                Si cargas este borrador, reemplazará el estado actual del editor (solo draft).
              </div>

              {draftSaveError ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-100">
                  {draftSaveError}
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={cn(
                    "rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-3 text-sm font-semibold",
                    draftSaving && "opacity-70"
                  )}
                  disabled={draftSaving}
                  onClick={async () => {
                    if (isDirty) {
                      const ok = window.confirm("Tienes cambios sin guardar en este dispositivo. ¿Reemplazarlos por el borrador del servidor?");
                      if (!ok) return;
                    }
                    setDraftSaving(true);
                    setDraftSaveError(null);
                    try {
                      const r = await fetch("/api/draft?include=1", { cache: "no-store" });
                      const json = (await r.json()) as { ok?: boolean; draft?: { dump?: unknown; savedAt?: number; hash?: string } | null };
                      const dump = json.ok ? (json.draft?.dump ?? null) : null;
                      if (!dump) throw new Error("missing_draft_dump");
                      applyDump(dump as Partial<SiteDump>);
                      useUndoStore.getState().clear();
                      const appliedAt = typeof json.draft?.savedAt === "number" ? json.draft.savedAt : Date.now();
                      setDraftSavedAt(Date.now());
                      if (typeof json.draft?.hash === "string") setDraftServerHash(json.draft.hash);
                      window.localStorage.setItem(DRAFT_APPLIED_AT_KEY, String(appliedAt));
                      setDraftRecoverOpen(false);
                    } catch (e: unknown) {
                      const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
                      setDraftSaveError(`No se pudo recuperar: ${message}`);
                    } finally {
                      setDraftSaving(false);
                    }
                  }}
                >
                  Cargar borrador
                </button>
                <button
                  type="button"
                  className={cn(
                    "rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10 transition",
                    draftSaving && "opacity-70"
                  )}
                  disabled={draftSaving}
                  onClick={async () => {
                    const ok = window.confirm("¿Descartar el borrador guardado en el servidor?");
                    if (!ok) return;
                    setDraftSaving(true);
                    setDraftSaveError(null);
                    try {
                      await fetch("/api/draft", {
                        method: "DELETE",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ baseHash: draftRecoverMeta.hash }),
                      });
                      window.localStorage.setItem(DRAFT_APPLIED_AT_KEY, String(Date.now()));
                      setDraftRecoverOpen(false);
                      setDraftRecoverMeta(null);
                    } catch (e: unknown) {
                      const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
                      setDraftSaveError(`No se pudo descartar: ${message}`);
                    } finally {
                      setDraftSaving(false);
                    }
                  }}
                >
                  Descartar
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {importOpen ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">Importar sitio</div>
                <div className="mt-1 text-xs text-white/60">Valida estructura, aplica migraciones y reemplaza el draft actual.</div>
              </div>
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                onClick={() => setImportOpen(false)}
              >
                Cerrar
              </button>
            </div>

            {importError ? (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                Import error: {importError}
              </div>
            ) : null}

            {!importError && importCandidate && typeof importCandidate === "object" ? (
              (() => {
                const c = importCandidate as Partial<SiteDump> & Record<string, unknown>;
                const pagesArr = Array.isArray(c.pages) ? (c.pages as unknown[]) : [];
                const blocksCount = pagesArr.reduce<number>((acc, p) => {
                  const blocks = p && typeof p === "object" && Array.isArray((p as Record<string, unknown>).blocks) ? ((p as Record<string, unknown>).blocks as unknown[]) : [];
                  return acc + blocks.length;
                }, 0);
                const tplBlocks = Array.isArray(c.blockTemplates) ? c.blockTemplates.length : 0;
                const tplPages = Array.isArray(c.pageTemplates) ? c.pageTemplates.length : 0;
                const mediaRefs = Array.isArray(c.mediaRefs) ? c.mediaRefs.length : 0;
                const exportedAt = typeof c.exportedAt === "number" ? c.exportedAt : 0;
                const exportedBy = typeof c.exportedBy === "string" ? c.exportedBy : "";
                const schemaVer =
                  c.schema && typeof c.schema === "object" && typeof (c.schema as Record<string, unknown>).blockSchemaVersion === "number"
                    ? ((c.schema as Record<string, unknown>).blockSchemaVersion as number)
                    : undefined;

                return (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70">
                      <div className="text-sm font-semibold text-white/85">Resumen</div>
                      <div className="mt-1 text-[11px] text-white/50">
                        {exportedAt ? new Date(exportedAt).toLocaleString() : "Fecha desconocida"}
                        {exportedBy ? ` · ${exportedBy}` : ""}
                        {schemaVer ? ` · schema v${schemaVer}` : ""}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-white/70">
                        <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">Páginas: {pagesArr.length}</div>
                        <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">Bloques: {blocksCount}</div>
                        <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">Plantillas bloque: {tplBlocks}</div>
                        <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">Plantillas página: {tplPages}</div>
                        <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 col-span-2">Media refs: {mediaRefs}</div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white/60">
                      Importar reemplazará tu draft actual. Recomendación: exporta antes si no estás seguro.
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        className={cn(
                          "rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10 transition",
                          !canEdit && "opacity-70"
                        )}
                        disabled={!canEdit}
                        onClick={() => {
                          const dump = getDump();
                          downloadJson(
                            `notsite-export-${new Date(dump.exportedAt).toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`,
                            dump
                          );
                          fetch("/api/audit", {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ action: "export", detail: "export_before_import" }),
                          }).catch(() => {});
                        }}
                      >
                        Exportar antes
                      </button>
                      <button
                        type="button"
                        className={cn(
                          "rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-3 text-sm font-semibold",
                          (!canEdit || draftSaving) && "opacity-70"
                        )}
                        disabled={!canEdit || draftSaving}
                        onClick={async () => {
                          if (!canEdit) return;
                          const ok = window.confirm("¿Importar y reemplazar el draft actual?");
                          if (!ok) return;
                          if (isDirty) {
                            const ok2 = window.confirm("Tienes cambios sin guardar. ¿Continuar igual?");
                            if (!ok2) return;
                          }
                          setDraftSaving(true);
                          try {
                            applyDump(c as Partial<SiteDump>);
                            setBackupResult("Import OK (cargado al editor).");
                            await fetch("/api/audit", {
                              method: "POST",
                              headers: { "content-type": "application/json" },
                              body: JSON.stringify({ action: "import", detail: `pages=${pagesArr.length}, blocks=${blocksCount}` }),
                            });
                            setImportOpen(false);
                          } catch (e: unknown) {
                            const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
                            setImportError(message);
                          } finally {
                            setDraftSaving(false);
                          }
                        }}
                      >
                        Importar
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="mt-4 text-xs text-white/60">Selecciona un archivo JSON desde “Importar JSON”.</div>
            )}
          </div>
        </div>
      ) : null}

      {publishOpen ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-4">
	              <div>
	                <div className="text-sm font-semibold">Publicar</div>
	                <div className="mt-1 text-xs text-white/60">
	                  Escribe a disco + (opcional) valida build + commit/push.
	                </div>
	                <div className="mt-1 text-[11px] text-white/40">
	                  Base publicado: {publishBaseHash ? `${publishBaseHash.slice(0, 10)}…` : "—"}
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

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">Versiones</div>
                    <div className="text-xs text-white/50">Rollback en 1 click (requiere publish habilitado).</div>
                  </div>
                  <button
                    type="button"
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                    disabled={versionsBusy}
                    onClick={async () => {
                      setVersionsBusy(true);
                      try {
                        const r = await fetch("/api/versions");
                        const json = (await r.json()) as { ok?: boolean; index?: { versions?: unknown } };
                        const list = Array.isArray(json.index?.versions) ? (json.index!.versions as typeof versions) : [];
                        setVersions(list);
                      } finally {
                        setVersionsBusy(false);
                      }
                    }}
                  >
                    {versionsBusy ? "Cargando…" : "Cargar"}
                  </button>
                </div>

                {versions.length ? (
                  <div className="mt-3 space-y-2 max-h-44 overflow-auto">
                    {versions.slice(0, 10).map((v) => (
                      <div key={v.id} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-xs font-semibold text-white/80">{v.id}</div>
                            <div className="truncate text-[11px] text-white/50">{v.message}</div>
                          </div>
                          <button
                            type="button"
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition"
                            disabled={publishBusy || !canPublish}
                            onClick={async () => {
                              if (!canPublish) return;
                              const ok = window.confirm("¿Hacer rollback a esta versión?");
                              if (!ok) return;
                              setPublishBusy(true);
                              setPublishResult(null);
                              try {
	                                const r = await fetch("/api/versions/rollback", {
	                                  method: "POST",
	                                  headers: { "content-type": "application/json" },
	                                  body: JSON.stringify({ id: v.id, baseHash: publishBaseHash }),
	                                });
	                                const json = await r.json();
	                                if (!json.ok) {
	                                  if (json.error === "conflict") {
	                                    setPublishResult(`Conflicto: publicación cambió.\n\nserverHash=${json.serverHash ?? "?"}`);
	                                  } else {
	                                    setPublishResult(`Error: ${json.error}`);
	                                  }
	                                } else setPublishResult(`Rollback OK: ${json.id}`);
	                              } catch (e: unknown) {
                                const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
                                setPublishResult(`Error: ${message}`);
                              } finally {
                                setPublishBusy(false);
                              }
                            }}
                          >
                            Rollback
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-white/50">Sin versiones aún (publica al menos una vez).</div>
                )}
              </div>

              <button
                type="button"
                className={cn(
                  "w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-3 text-sm font-semibold",
                  "shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition",
                  (publishBusy || !canPublish) && "opacity-70"
                )}
                disabled={publishBusy || !canPublish}
                onClick={async () => {
                  if (!canPublish) return;
                  setPublishBusy(true);
                  setPublishResult(null);
                  try {
                    const r = await fetch("/api/publish", {
                      method: "POST",
                      headers: {
                        "content-type": "application/json",
                      },
	                      body: JSON.stringify({
	                        theme,
	                        content,
	                        pages,
	                        articles: { columns: articleColumns, reviews: articleReviews },
	                        baseHash: publishBaseHash,
	                        validateBuild: publishValidate,
	                        gitCommitPush: publishGit,
	                        commitMessage: `chore(publish): ${new Date().toISOString()}`,
	                      }),
	                    });
	                    const json = await r.json();
	                    if (!json.ok) {
	                      if (json.error === "conflict") {
	                        setPublishResult(
	                          `Conflicto: hay una publicación más reciente.\n\nActualiza tu base (abre “Preview cambios” o cierra y abre Publicar).\n\nserverHash=${json.serverHash ?? "?"}`
	                        );
	                      } else {
	                        setPublishResult(`Error: ${json.error}\n\n${JSON.stringify(json.logs ?? [], null, 2)}`);
	                      }
	                    } else {
	                      if (typeof json.hash === "string") setPublishBaseHash(json.hash);
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

      <PreviewChangesModal
        open={previewOpen}
        busy={previewBusy}
        error={previewError}
        draftPages={pages}
        published={publishedState}
        initialPageId={selectedPage}
        onClose={() => setPreviewOpen(false)}
      />

      <div className="relative z-10 flex h-[calc(100%-4rem)]">
        {/* Sidebar */}
        <aside className="w-[380px] border-r border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="grid grid-cols-3 gap-2 p-3">
            <button
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold border transition inline-flex items-center justify-center gap-2",
                tab === "site"
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              )}
              onClick={() => setTab("site")}
            >
              <LayoutGrid className="h-4 w-4" />
              Sitio
            </button>
            <button
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold border transition inline-flex items-center justify-center gap-2",
                tab === "content"
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                !canEdit && "opacity-60 cursor-not-allowed"
              )}
              disabled={!canEdit}
              onClick={() => {
                if (!canEdit) return;
                setTab("content");
              }}
            >
              <Sparkles className="h-4 w-4" />
              Contenido
            </button>
            <button
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold border transition inline-flex items-center justify-center gap-2",
                tab === "style"
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                !canEdit && "opacity-60 cursor-not-allowed"
              )}
              disabled={!canEdit}
              onClick={() => {
                if (!canEdit) return;
                setTab("style");
              }}
            >
              <Paintbrush className="h-4 w-4" />
              Estilo
            </button>
            <button
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold border transition inline-flex items-center justify-center gap-2",
                tab === "media"
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                !canEdit && "opacity-60 cursor-not-allowed"
              )}
              disabled={!canEdit}
              onClick={() => {
                if (!canEdit) return;
                setTab("media");
              }}
            >
              <ImageIcon className="h-4 w-4" />
              Media
            </button>
            <button
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold border transition inline-flex items-center justify-center gap-2",
                tab === "people"
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                !canEdit && "opacity-60 cursor-not-allowed"
              )}
              disabled={!canEdit}
              onClick={() => {
                if (!canEdit) return;
                setTab("people");
              }}
            >
              <Users className="h-4 w-4" />
              Opiniones
            </button>
            <button
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold border transition inline-flex items-center justify-center gap-2",
                tab === "articles"
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                !canEdit && "opacity-60 cursor-not-allowed"
              )}
              disabled={!canEdit}
              onClick={() => {
                if (!canEdit) return;
                setTab("articles");
              }}
            >
              <BookOpen className="h-4 w-4" />
              Artículos
            </button>
            <button
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold border transition inline-flex items-center justify-center gap-2",
                tab === "leads"
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                !canReadLeads && "opacity-60 cursor-not-allowed"
              )}
              disabled={!canReadLeads}
              onClick={() => {
                if (!canReadLeads) return;
                setTab("leads");
              }}
            >
              <Inbox className="h-4 w-4" />
              Leads
            </button>
            {canManageUsers ? (
              <button
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-semibold border transition inline-flex items-center justify-center gap-2",
                  tab === "access"
                    ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                )}
                onClick={() => setTab("access")}
              >
                <ShieldCheck className="h-4 w-4" />
                Accesos
              </button>
            ) : null}
          </div>

          <div className="h-[calc(100%-3.25rem)] overflow-auto px-3 pb-6">
            <div className="pt-3">
              <BlockInspector />
            </div>
            {tab === "site" ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Páginas</div>
                      <div className="mt-1 text-xs text-white/50">Crea rutas y edita con bloques.</div>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                      disabled={!canEdit}
                      onClick={() => {
                        if (!canEdit) return;
                        const id = addPage();
                        selectPage(id);
                      }}
                    >
                      + Nueva
                    </button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {pages
                      .filter((p) => (p.kind ?? "page") === "page")
                      .filter((p) => p.slug !== "" || p.id === "home")
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className={cn(
                            "w-full rounded-xl border px-3 py-2 text-left transition",
                            "border-white/10 bg-white/5 hover:bg-white/10",
                            selectedPage === p.id && "border-cyan-500/30 bg-cyan-500/10"
                          )}
                          onClick={() => selectPage(p.id)}
                        >
                          <div className="truncate text-sm font-semibold">{p.title}</div>
                          <div className="mt-0.5 flex items-center justify-between gap-3 text-[11px] text-white/50">
                            <span className="truncate">{p.slug ? `/${p.slug}` : "/"}</span>
                            <span className="shrink-0">{p.visible ? "Visible" : "Oculta"}</span>
                          </div>
                        </button>
                      ))}
                  </div>

                  {(() => {
                    const active = pages.find((p) => p.id === selectedPage) ?? null;
                    if (!active) return null;
                    const isGlobal = (active.kind ?? "page") === "global";

                    return (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white/70">Título</div>
                            <input
                              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                              value={active.title}
                              disabled={!canEdit}
                              onChange={(e) => {
                                if (!canEdit) return;
                                updatePage(active.id, { title: e.target.value });
                              }}
                            />
                            {!isGlobal ? (
                              <>
                                <div className="mt-3 text-xs font-semibold text-white/70">Slug</div>
                                <div className="mt-2 flex items-center gap-2">
                                  <div className="text-xs text-white/50">/</div>
                                  <input
                                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                                    value={active.slug}
                                    disabled={!canEdit || active.slug === ""}
                                    onChange={(e) => {
                                      if (!canEdit) return;
                                      renamePageSlug(active.id, e.target.value);
                                    }}
                                  />
                                </div>
                              </>
                            ) : (
                              <div className="mt-2 text-[11px] text-white/50">
                                Sección global (reutilizable). No tiene ruta pública.
                              </div>
                            )}
                            <div className="mt-2 flex items-center justify-between">
                              <label className="inline-flex items-center gap-2 text-xs text-white/60">
                                <input
                                  type="checkbox"
                                  checked={active.visible}
                                  disabled={!canEdit}
                                  onChange={(e) => {
                                    if (!canEdit) return;
                                    updatePage(active.id, { visible: e.target.checked });
                                  }}
                                />
                                Visible
                              </label>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                                  onClick={() => {
                                    if (isGlobal) return;
                                    if (!canEdit) return;
                                    const name = window.prompt("Nombre de la plantilla:", active.title || "Plantilla") ?? "";
                                    addPageTemplate(name || active.title || "Plantilla", active);
                                  }}
                                  disabled={isGlobal || !canEdit}
                                >
                                  Guardar como template
                                </button>
                                <button
                                  type="button"
                                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                                  onClick={() => {
                                    if (isGlobal) return;
                                    if (!canEdit) return;
                                    duplicatePage(active.id);
                                  }}
                                  disabled={isGlobal || !canEdit}
                                >
                                  Duplicar
                                </button>
                                <button
                                  type="button"
                                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition text-red-200"
                                  disabled={(!canEdit) || ((!isGlobal && active.slug === "") || active.id === "home")}
                                  onClick={() => {
                                    if (!isGlobal && active.slug === "") return;
                                    if (!canEdit) return;
                                    const ok = window.confirm(isGlobal ? "¿Eliminar esta sección global?" : "¿Eliminar esta página?");
                                    if (!ok) return;
                                    if (isGlobal) {
                                      deleteGlobalSection(active.id);
                                      selectPage("home");
                                    } else {
                                      deletePage(active.id);
                                      selectPage("home");
                                    }
                                  }}
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>

                            {!isGlobal ? (
                              <details className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                                <summary className="cursor-pointer text-xs font-semibold text-white/80 select-none">
                                  SEO
                                </summary>
                              <div className="mt-3 space-y-3">
                                <label className="block text-xs text-white/60">
                                  Title
                                  <input
                                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                                    value={active.seo?.title ?? ""}
                                    onChange={(e) =>
                                      updatePage(active.id, {
                                        seo: { ...active.seo, title: e.target.value },
                                      })
                                    }
                                  />
                                </label>
                                <label className="block text-xs text-white/60">
                                  Meta description
                                  <textarea
                                    className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                                    rows={2}
                                    value={active.seo?.description ?? ""}
                                    onChange={(e) =>
                                      updatePage(active.id, {
                                        seo: { ...active.seo, description: e.target.value },
                                      })
                                    }
                                  />
                                </label>
                                <label className="block text-xs text-white/60">
                                  OG title
                                  <input
                                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                                    value={active.seo?.ogTitle ?? ""}
                                    onChange={(e) =>
                                      updatePage(active.id, {
                                        seo: { ...active.seo, ogTitle: e.target.value },
                                      })
                                    }
                                  />
                                </label>
                                <label className="block text-xs text-white/60">
                                  OG description
                                  <textarea
                                    className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                                    rows={2}
                                    value={active.seo?.ogDescription ?? ""}
                                    onChange={(e) =>
                                      updatePage(active.id, {
                                        seo: { ...active.seo, ogDescription: e.target.value },
                                      })
                                    }
                                  />
                                </label>
                                <label className="block text-xs text-white/60">
                                  OG image (ruta/URL)
                                  <input
                                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                                    value={active.seo?.ogImage ?? ""}
                                    onChange={(e) =>
                                      updatePage(active.id, {
                                        seo: { ...active.seo, ogImage: e.target.value },
                                      })
                                    }
                                  />
                                </label>
                                <label className="block text-xs text-white/60">
                                  Canonical (opcional)
                                  <input
                                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                                    value={active.seo?.canonical ?? ""}
                                    onChange={(e) =>
                                      updatePage(active.id, {
                                        seo: { ...active.seo, canonical: e.target.value },
                                      })
                                    }
                                  />
                                </label>
                                <label className="inline-flex items-center gap-2 text-xs text-white/60">
                                  <input
                                    type="checkbox"
                                    checked={active.seo?.noIndex ?? false}
                                    onChange={(e) =>
                                      updatePage(active.id, {
                                        seo: { ...active.seo, noIndex: e.target.checked },
                                      })
                                    }
                                  />
                                  No index
                                </label>
                              </div>
                              </details>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                            disabled={!canEdit}
                            onClick={() => {
                              if (!canEdit) return;
                              addBlock(active.id, "hero", "premium");
                            }}
                          >
                            + Hero
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                            disabled={!canEdit}
                            onClick={() => {
                              if (!canEdit) return;
                              addBlock(active.id, "richText", "minimal");
                            }}
                          >
                            + Texto
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                            disabled={!canEdit}
                            onClick={() => {
                              if (!canEdit) return;
                              addBlock(active.id, "features", "corporate");
                            }}
                          >
                            + Features
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                            disabled={!canEdit}
                            onClick={() => {
                              if (!canEdit) return;
                              addBlock(active.id, "faq", "minimal");
                            }}
                          >
                            + FAQ
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                            disabled={!canEdit}
                            onClick={() => {
                              if (!canEdit) return;
                              addBlock(active.id, "pricing", "premium");
                            }}
                          >
                            + Pricing
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                            disabled={!canEdit}
                            onClick={() => {
                              if (!canEdit) return;
                              addBlock(active.id, "cta", "bold");
                            }}
                          >
                            + CTA
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                            disabled={!canEdit}
                            onClick={() => {
                              if (!canEdit) return;
                              addBlock(active.id, "form", "corporate");
                            }}
                          >
                            + Form
                          </button>
                        </div>

                        <div className="mt-4 text-xs font-semibold text-white/70">Bloques</div>
                        <div className="mt-2 space-y-2">
                          <Reorder.Group
                            axis="y"
                            values={active.blocks}
                            onReorder={(next) => {
                              if (!canEdit) return;
                              reorderBlocks(active.id, next);
                            }}
                            className="space-y-2"
                          >
                            {active.blocks.map((b) => (
                              <Reorder.Item
                                key={b.id}
                                value={b}
                                dragListener={!b.locked && canEdit}
                                className={cn(
                                  "group rounded-xl border px-3 py-2 text-sm",
                                  "border-white/10 bg-white/5 hover:bg-white/10 transition",
                                  !b.visible && "opacity-50"
                                )}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold">{b.type}</div>
                                    <div className="mt-0.5 text-[11px] text-white/50 truncate">
                                      {b.locked ? "Bloqueado" : "Arrastrable"} · Preset: {b.preset}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
                                      disabled={!canEdit}
                                      onClick={() => {
                                        if (!canEdit) return;
                                        toggleBlockVisible(active.id, b.id);
                                      }}
                                      aria-label={b.visible ? "Ocultar bloque" : "Mostrar bloque"}
                                    >
                                      {b.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                    </button>
                                    <button
                                      type="button"
                                      className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
                                      disabled={!canEdit}
                                      onClick={() => {
                                        if (!canEdit) return;
                                        setBlockLocked(active.id, b.id, !b.locked);
                                      }}
                                      aria-label={b.locked ? "Desbloquear" : "Bloquear"}
                                    >
                                      {b.locked ? "🔒" : "🔓"}
                                    </button>
                                    <button
                                      type="button"
                                      className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
                                      disabled={!canEdit}
                                      onClick={() => {
                                        if (!canEdit) return;
                                        duplicateBlock(active.id, b.id);
                                      }}
                                      aria-label="Duplicar bloque"
                                    >
                                      ⎘
                                    </button>
                                    <button
                                      type="button"
                                      className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
                                      onClick={() => {
                                        if (!canEdit) return;
                                        const ok = window.confirm("¿Eliminar este bloque?");
                                        if (!ok) return;
                                        deleteBlock(active.id, b.id);
                                      }}
                                      aria-label="Eliminar bloque"
                                      disabled={!canEdit}
                                    >
                                      ⌫
                                    </button>
                                  </div>
                                </div>

                                <div className="mt-2 grid grid-cols-2 gap-2">
                                  <label className="text-[11px] text-white/60">
                                    Preset
                                    <select
                                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-xs outline-none"
                                      value={b.preset}
                                      disabled={!canEdit}
                                      onChange={(e) => {
                                        if (!canEdit) return;
                                        setBlockPreset(active.id, b.id, e.target.value as SiteBlock["preset"]);
                                      }}
                                    >
                                      <option value="minimal">Minimal</option>
                                      <option value="corporate">Corporate</option>
                                      <option value="premium">Premium</option>
                                      <option value="bold">Bold</option>
                                    </select>
                                  </label>
                                  <label className="text-[11px] text-white/60">
                                    Fondo
                                    <input
                                      type="color"
                                      className="mt-1 h-8 w-full cursor-pointer rounded-lg border border-white/10 bg-transparent"
                                      value={b.style?.base?.background ?? "transparent"}
                                      disabled={!canEdit}
                                      onChange={(e) => {
                                        if (!canEdit) return;
                                        const base = b.style?.base ?? {
                                          paddingY: 72,
                                          paddingX: 16,
                                          maxWidth: 1200,
                                          background: "transparent",
                                          textAlign: "left" as const,
                                          radius: 16,
                                          shadow: 0.2,
                                        };
                                        updateBlockStyle(active.id, b.id, { ...b.style, base: { ...base, background: e.target.value } });
                                      }}
                                    />
                                  </label>
                                </div>
                              </Reorder.Item>
                            ))}
                          </Reorder.Group>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition"
                            disabled={!canEdit}
                            onClick={() => {
                              if (!canEdit) return;
                              resetPages();
                            }}
                          >
                            Reset páginas
                          </button>
                          <button
                            type="button"
                            className={cn(
                              "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition",
                              !canPublish && "opacity-60 cursor-not-allowed"
                            )}
                            disabled={!canPublish}
                            onClick={() => {
                              if (!canPublish) return;
                              setPublishOpen(true);
                            }}
                          >
                            Publicar
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {!canEdit ? (
                  <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                    <div className="text-sm font-semibold">Modo viewer (solo lectura)</div>
                    <div className="mt-1 text-xs text-white/60">
                      Tu rol no permite editar. Pide acceso de Editor o Admin para hacer cambios.
                    </div>
                  </div>
                ) : null}

                <div className={cn(!canEdit && "pointer-events-none opacity-60")}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Secciones globales</div>
                      <div className="mt-1 text-xs text-white/50">Edita una vez y se actualiza donde se use.</div>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                      onClick={() => {
                        const name = window.prompt("Nombre de la sección global:", "CTA Global") ?? "";
                        const id = addGlobalSection(name || "Sección global");
                        selectPage(id);
                      }}
                    >
                      + Nueva global
                    </button>
                  </div>

                  {selectedBlockId && selectedBlockPageId ? (
                    <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                      <div className="text-xs font-semibold text-white/70">Acción rápida</div>
                      <div className="mt-1 text-xs text-white/50">Convierte el bloque seleccionado en una sección global reutilizable.</div>
                      <button
                        type="button"
                        className="mt-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-xs font-semibold"
                        onClick={() => {
                          const name = window.prompt("Nombre de la sección global:", "Sección global") ?? "";
                          makeBlockGlobal(selectedBlockPageId, selectedBlockId, name || undefined);
                        }}
                      >
                        Hacer global
                      </button>
                    </div>
                  ) : null}

                  <div className="mt-4 space-y-2">
                    {pages
                      .filter((p) => (p.kind ?? "page") === "global")
                      .slice()
                      .reverse()
                      .map((g) => (
                        <div key={g.id} className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                          <button
                            type="button"
                            className={cn(
                              "min-w-0 flex-1 text-left",
                              selectedPage === g.id ? "text-cyan-100" : "text-white/80"
                            )}
                            onClick={() => selectPage(g.id)}
                          >
                            <div className="truncate text-sm font-semibold">{g.title}</div>
                            <div className="truncate text-[11px] text-white/50">{g.id}</div>
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition"
                              onClick={() => {
                                const targetPage = pages.find((p) => p.id === selectedPage) ?? null;
                                if (!targetPage || (targetPage.kind ?? "page") !== "page") {
                                  alert("Selecciona una página (no una global) para insertar.");
                                  return;
                                }
                                const after =
                                  selectedBlockPageId === selectedPage ? selectedBlockId : null;
                                insertGlobalRef(selectedPage, g.id, after);
                              }}
                            >
                              Insertar
                            </button>
                            <button
                              type="button"
                              className="rounded-lg px-2 py-2 text-[11px] font-semibold text-white/60 hover:text-red-200 hover:bg-white/10 transition"
                              onClick={() => {
                                const ok = window.confirm("¿Eliminar esta sección global?");
                                if (!ok) return;
                                deleteGlobalSection(g.id);
                                if (selectedPage === g.id) selectPage("home");
                              }}
                              aria-label="Eliminar global"
                            >
                              ⌫
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  {!pages.some((p) => (p.kind ?? "page") === "global") ? (
                    <div className="mt-3 text-xs text-white/50">Aún no hay secciones globales.</div>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Plantillas de páginas</div>
                      <div className="mt-1 text-xs text-white/50">Crea nuevas páginas desde una plantilla completa.</div>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                      onClick={() => {
                        const ok = window.confirm("¿Resetear templates de páginas?");
                        if (!ok) return;
                        resetPageTemplates();
                      }}
                    >
                      Reset
                    </button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {pageTemplates
                      .slice()
                      .reverse()
                      .map((t) => (
                        <div key={t.id} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <input
                                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                                value={t.name}
                                onChange={(e) => renamePageTemplate(t.id, e.target.value)}
                              />
                              <div className="mt-1 truncate text-[11px] text-white/50">
                                {t.page?.title ?? "Página"} · {t.page?.blocks?.length ?? 0} bloques
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
	                              <button
	                                type="button"
	                                className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-[11px] font-semibold"
	                                onClick={() => {
	                                  const id = addPage();
	                                  const base = t.page as unknown as Partial<SitePage> & { blocks?: unknown; slug?: unknown };
	                                  const baseSeo = (base.seo ?? {}) as Partial<SitePage["seo"]> & Record<string, unknown>;
	                                  const title = typeof baseSeo.title === "string" ? baseSeo.title : base.title || "Nueva página";
	                                  const description = typeof baseSeo.description === "string" ? baseSeo.description : "";
	                                  updatePage(id, {
	                                    title: base.title || "Nueva página",
	                                    visible: true,
	                                    kind: "page",
	                                    chrome: base.chrome ?? { useGlobalNavigation: true, useGlobalFooter: true },
	                                    seo: {
	                                      title,
	                                      description,
	                                      ogTitle: typeof baseSeo.ogTitle === "string" ? baseSeo.ogTitle : title,
	                                      ogDescription: typeof baseSeo.ogDescription === "string" ? baseSeo.ogDescription : description,
	                                      ogImage: typeof baseSeo.ogImage === "string" ? baseSeo.ogImage : "",
	                                      noIndex: typeof baseSeo.noIndex === "boolean" ? baseSeo.noIndex : false,
	                                      canonical: typeof baseSeo.canonical === "string" ? baseSeo.canonical : "",
	                                    },
	                                  });
	                                  // Clone blocks with fresh IDs.
	                                  const blocks = Array.isArray(base.blocks) ? (base.blocks as SiteBlock[]) : [];
	                                  const cloned = blocks.map((b) => ({
                                    ...structuredClone(b),
                                    id: `blk-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`,
                                    locked: false,
                                    visible: true,
                                  }));
                                  replaceBlocks(id, cloned);
                                  if (typeof base.slug === "string" && base.slug) renamePageSlug(id, base.slug);
                                  selectPage(id);
                                }}
                              >
                                Crear página
                              </button>
                              <button
                                type="button"
                                className="rounded-lg px-2 py-2 text-[11px] font-semibold text-white/60 hover:text-red-200 hover:bg-white/10 transition"
                                onClick={() => {
                                  const ok = window.confirm("¿Eliminar esta plantilla?");
                                  if (!ok) return;
                                  deletePageTemplate(t.id);
                                }}
                                aria-label="Eliminar plantilla"
                              >
                                ⌫
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {!pageTemplates.length ? (
                    <div className="mt-3 text-xs text-white/50">Aún no hay plantillas. Guarda una página como template.</div>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Navegación (menú)</div>
                  <div className="mt-1 text-xs text-white/50">Soporta submenú (1 nivel).</div>

                  <div className="mt-4 space-y-2">
                    {(content.navigation?.items ?? []).map((it, idx) => (
                      <div key={it.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <input
                              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                              value={it.label}
                              onChange={(e) => setContent(`navigation.items.${idx}.label`, e.target.value)}
                            />
                            <input
                              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs outline-none text-white/80"
                              value={it.href}
                              onChange={(e) => setContent(`navigation.items.${idx}.href`, e.target.value)}
                            />
                            <button
                              type="button"
                              className="mt-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold text-white/80 hover:bg-white/10 transition"
                              onClick={() => {
                                const next = [...(it.children ?? [])];
                                next.push({
                                  id: `nav-${Date.now()}`,
                                  label: "Subitem",
                                  href: "/",
                                  visible: true,
                                  children: [],
                                });
                                setContent(`navigation.items.${idx}.children`, next);
                              }}
                            >
                              + Subitem
                            </button>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="inline-flex items-center gap-2 text-xs text-white/60">
                              <input
                                type="checkbox"
                                checked={it.visible}
                                onChange={(e) => setContent(`navigation.items.${idx}.visible`, e.target.checked)}
                              />
                              Visible
                            </label>
                            <button
                              type="button"
                              className="rounded-lg p-2 text-white/60 hover:text-red-200 hover:bg-white/10 transition"
                              onClick={() => {
                                const ok = window.confirm("¿Eliminar item del menú?");
                                if (!ok) return;
                                const next = (content.navigation.items ?? []).filter((_, i) => i !== idx);
                                setContent("navigation.items", next);
                              }}
                              aria-label="Eliminar"
                            >
                              ⌫
                            </button>
                          </div>
                        </div>

                        {(it.children ?? []).length ? (
                          <div className="mt-3 space-y-2 pl-4 border-l border-white/10">
                            {(it.children ?? []).map((ch, cidx) => (
                              <div key={ch.id || cidx} className="rounded-xl border border-white/10 bg-black/20 p-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <input
                                      className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                                      value={ch.label}
                                      onChange={(e) =>
                                        setContent(`navigation.items.${idx}.children.${cidx}.label`, e.target.value)
                                      }
                                    />
                                    <input
                                      className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs outline-none text-white/80"
                                      value={ch.href}
                                      onChange={(e) =>
                                        setContent(`navigation.items.${idx}.children.${cidx}.href`, e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <label className="inline-flex items-center gap-2 text-xs text-white/60">
                                      <input
                                        type="checkbox"
                                        checked={ch.visible}
                                        onChange={(e) =>
                                          setContent(
                                            `navigation.items.${idx}.children.${cidx}.visible`,
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Visible
                                    </label>
                                    <button
                                      type="button"
                                      className="rounded-lg p-2 text-white/60 hover:text-red-200 hover:bg-white/10 transition"
                                      onClick={() => {
                                        const next = (it.children ?? []).filter((_, i) => i !== cidx);
                                        setContent(`navigation.items.${idx}.children`, next);
                                      }}
                                      aria-label="Eliminar"
                                    >
                                      ⌫
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition"
                    onClick={() => {
                      const next = [...(content.navigation.items ?? [])];
                      next.push({ id: `nav-${Date.now()}`, label: "Nuevo", href: "/", visible: true, children: [] });
                      setContent("navigation.items", next);
                    }}
                  >
                    + Item de menú
                  </button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Footer</div>
                  <div className="mt-1 text-xs text-white/50">Columnas y links.</div>

                  <div className="mt-4 space-y-3">
                    {(content.footer.columns ?? []).map((col, colIdx) => (
                      <div key={col.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <input
                            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                            value={col.title}
                            onChange={(e) => setContent(`footer.columns.${colIdx}.title`, e.target.value)}
                          />
                          <button
                            type="button"
                            className="rounded-lg p-2 text-white/60 hover:text-red-200 hover:bg-white/10 transition"
                            onClick={() => {
                              const ok = window.confirm("¿Eliminar columna?");
                              if (!ok) return;
                              const next = (content.footer.columns ?? []).filter((_, i) => i !== colIdx);
                              setContent("footer.columns", next);
                            }}
                            aria-label="Eliminar columna"
                          >
                            ⌫
                          </button>
                        </div>

                        <div className="mt-3 space-y-2">
                          {(col.links ?? []).map((lnk, linkIdx: number) => (
                            <div key={lnk.id || linkIdx} className="grid grid-cols-1 gap-2">
                              <input
                                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs outline-none text-white/80"
                                value={lnk.label}
                                onChange={(e) =>
                                  setContent(`footer.columns.${colIdx}.links.${linkIdx}.label`, e.target.value)
                                }
                                placeholder="Etiqueta"
                              />
                              <div className="flex items-center gap-2">
                                <input
                                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs outline-none text-white/80"
                                  value={lnk.href}
                                  onChange={(e) =>
                                    setContent(`footer.columns.${colIdx}.links.${linkIdx}.href`, e.target.value)
                                  }
                                  placeholder="/ruta o https://"
                                />
                                <button
                                  type="button"
                                  className="rounded-lg p-2 text-white/60 hover:text-red-200 hover:bg-white/10 transition"
                                  onClick={() => {
                                    const next = (col.links ?? []).filter((_, i) => i !== linkIdx);
                                    setContent(`footer.columns.${colIdx}.links`, next);
                                  }}
                                  aria-label="Eliminar link"
                                >
                                  ⌫
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition"
                          onClick={() => {
                            const next = [...(col.links ?? [])];
                            next.push({ id: `lnk-${Date.now()}`, label: "Nuevo link", href: "/", visible: true });
                            setContent(`footer.columns.${colIdx}.links`, next);
                          }}
                        >
                          + Link
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition"
                    onClick={() => {
                      const next = [...(content.footer.columns ?? [])];
                      next.push({ id: `col-${Date.now()}`, title: "Nueva columna", visible: true, links: [] });
                      setContent("footer.columns", next);
                    }}
                  >
                    + Columna
                  </button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Integraciones</div>
                  <div className="mt-1 text-xs text-white/50">Analytics, Pixel, calendario.</div>

                  <div className="mt-4 space-y-3">
                    <label className="block text-xs text-white/60">
                      Google Analytics ID (G-XXXX)
                      <input
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                        value={content.integrations.googleAnalyticsId}
                        onChange={(e) => setContent("integrations.googleAnalyticsId", e.target.value)}
                      />
                    </label>
                    <label className="block text-xs text-white/60">
                      Google Tag Manager ID (GTM-XXXX)
                      <input
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                        value={content.integrations.googleTagId}
                        onChange={(e) => setContent("integrations.googleTagId", e.target.value)}
                      />
                    </label>
                    <label className="block text-xs text-white/60">
                      Meta Pixel ID
                      <input
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                        value={content.integrations.metaPixelId}
                        onChange={(e) => setContent("integrations.metaPixelId", e.target.value)}
                      />
                    </label>
                    <label className="block text-xs text-white/60">
                      Calendario (Cal.com u otro)
                      <input
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                        value={content.integrations.calLink}
                        onChange={(e) => setContent("integrations.calLink", e.target.value)}
                        placeholder="https://cal.com/tu-link"
                      />
                    </label>
                    <label className="block text-xs text-white/60">
                      WhatsApp (link)
                      <input
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                        value={content.footer.whatsappHref}
                        onChange={(e) => setContent("footer.whatsappHref", e.target.value)}
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Asistente IA</div>
                  <div className="mt-1 text-xs text-white/50">Genera páginas y secciones desde un prompt.</div>

                  <textarea
                    className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                    rows={4}
                    placeholder="Ej: Crea una página de consultoría para municipios con enfoque en infancia y salud mental..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    disabled={aiBusy || !canUseAi}
                  />

                  {aiResult ? (
                    <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70 whitespace-pre-wrap">
                      {aiResult}
                    </div>
                  ) : null}

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className={cn(
                        "rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-xs font-semibold",
                        aiBusy && "opacity-70"
                      )}
                      disabled={aiBusy}
                      onClick={async () => {
                        if (!canUseAi) return;
                        setAiBusy(true);
                        setAiResult(null);
                        try {
                          const r = await fetch("/api/ai", {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ mode: "create_page", prompt: aiPrompt }),
                          });
                          const json = (await r.json()) as {
                            ok?: boolean;
                            error?: string;
                            page?: { title: string; slug: string; blocks: SiteBlock[] };
                          };
                          if (!json.ok) {
                            setAiResult(`Error: ${json.error}`);
                            return;
                          }
	                          const page = json.page!;
	                          const id = addPage();
	                          updatePage(id, {
	                            title: page.title,
	                            seo: { title: page.title, description: "", ogTitle: page.title, ogDescription: "", ogImage: "", noIndex: false, canonical: "" },
	                          });
                          // Try to apply slug; if taken, keep auto-generated.
                          renamePageSlug(id, page.slug);
                          replaceBlocks(id, page.blocks);
                          selectPage(id);
                          setAiResult(`Página creada: /${page.slug}`);
                        } catch (e: unknown) {
                          const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
                          setAiResult(`Error: ${message}`);
                        } finally {
                          setAiBusy(false);
                        }
                      }}
                    >
                      Crear página
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition",
                        aiBusy && "opacity-70"
                      )}
                      disabled={aiBusy}
                      onClick={async () => {
                        if (!canUseAi) return;
                        setAiBusy(true);
                        setAiResult(null);
                        try {
                          const targetPageId = selectedBlockPageId ?? selectedPage;
                          const afterId = selectedBlockId ?? null;
                          const r = await fetch("/api/ai", {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ mode: "insert_block", prompt: aiPrompt }),
                          });
                          const json = (await r.json()) as { ok?: boolean; error?: string; block?: SiteBlock };
                          if (!json.ok) {
                            setAiResult(`Error: ${json.error}`);
                            return;
                          }
                          const block = json.block!;
                          insertBlock(targetPageId, block, afterId);
                          setAiResult("Sección insertada.");
                        } catch (e: unknown) {
                          const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
                          setAiResult(`Error: ${message}`);
                        } finally {
                          setAiBusy(false);
                        }
                      }}
                    >
                      Insertar sección
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "col-span-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition",
                        aiBusy && "opacity-70"
                      )}
                      disabled={aiBusy || !selectedTextPath || !canUseAi}
                      onClick={async () => {
                        if (!selectedTextPath) return;
                        if (!canUseAi) return;
                        setAiBusy(true);
                        setAiResult(null);
                        try {
                          const current = get<string>(selectedTextPath) ?? "";
                          const r = await fetch("/api/ai", {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ mode: "improve_text", prompt: current }),
                          });
                          const json = (await r.json()) as { ok?: boolean; error?: string; text?: string };
                          if (!json.ok) {
                            setAiResult(`Error: ${json.error}`);
                            return;
                          }
                          setContent(selectedTextPath, json.text ?? current);
                          setAiResult("Texto mejorado.");
                        } catch (e: unknown) {
                          const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
                          setAiResult(`Error: ${message}`);
                        } finally {
                          setAiBusy(false);
                        }
                      }}
                    >
                      Mejorar texto seleccionado
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Export / Backup / Restore</div>
                      <div className="mt-1 text-xs text-white/50">Exporta tu sitio a JSON, importa y guarda backups en servidor.</div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition"
                      onClick={() => {
                        const dump = getDump();
                        downloadJson(`notsite-export-${new Date(dump.exportedAt).toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`, dump);
                        setBackupResult("Export descargado.");
                        fetch("/api/audit", {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ action: "export", detail: `pages=${Array.isArray(dump.pages) ? dump.pages.length : "?"}` }),
                        }).catch(() => {});
                      }}
                    >
                      Exportar JSON
                    </button>

                    <label className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition cursor-pointer text-center">
                      Importar JSON
                      <input
                        type="file"
                        accept="application/json"
                        className="hidden"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          try {
                            const raw = await f.text();
                            const parsed = JSON.parse(raw) as unknown;
                            setImportCandidate(parsed);
                            setImportError(null);
                            setImportOpen(true);
                          } catch (err: unknown) {
                            const message = err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
                            setImportError(message);
                            setImportCandidate(null);
                            setImportOpen(true);
                          } finally {
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                    </label>
                  </div>

                  <details className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                    <summary className="cursor-pointer text-xs font-semibold text-white/80 select-none">Version History</summary>
                    <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">Revisiones</div>
                          <div className="mt-1 text-xs text-white/50">Cada publicación guarda una versión (preview + restore).</div>
                        </div>
                        <button
                          type="button"
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                          disabled={versionsBusy}
                          onClick={async () => {
                            setVersionsBusy(true);
                            setOpsResult(null);
                            try {
                              const r = await fetch("/api/versions", { cache: "no-store" });
                              const json = (await r.json()) as { ok?: boolean; index?: { versions?: unknown } };
                              const list = Array.isArray(json.index?.versions) ? (json.index!.versions as typeof versions) : [];
                              setVersions(list);
                            } catch (e: unknown) {
                              const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
                              setOpsResult(`Versiones: ${message}`);
                            } finally {
                              setVersionsBusy(false);
                            }
                          }}
                        >
                          {versionsBusy ? "Cargando…" : "Cargar"}
                        </button>
                      </div>

                      {opsResult ? (
                        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70 whitespace-pre-wrap">
                          {opsResult}
                        </div>
                      ) : null}

                      {versions.length ? (
                        <div className="mt-3 space-y-2 max-h-56 overflow-auto">
                          {versions.slice(0, 25).map((v) => (
                            <div key={v.id} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="truncate text-xs font-semibold text-white/85">{v.message || v.id}</div>
                                  <div className="mt-1 truncate text-[11px] text-white/45">
                                    {new Date(v.createdAt || Date.now()).toLocaleString()}
                                    {v.user ? ` · ${v.user}` : ""} · {v.id}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition"
                                    onClick={() => {
                                      const scope = `ver-${v.id}`;
                                      const url = `/admin/preview?pageId=${encodeURIComponent(selectedPage)}&versionId=${encodeURIComponent(
                                        v.id
                                      )}&storageScope=${encodeURIComponent(scope)}`;
                                      window.open(url, "_blank", "noopener,noreferrer");
                                    }}
                                  >
                                    Preview
                                  </button>
                                  <button
                                    type="button"
                                    className={cn(
                                      "rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-[11px] font-semibold",
                                      (!canPublish || publishBusy) && "opacity-70"
                                    )}
                                    disabled={!canPublish || publishBusy}
                                    onClick={async () => {
                                      if (!canPublish) return;
                                      const ok = window.confirm("¿Restaurar y PUBLICAR esta versión?");
                                      if (!ok) return;
                                      setPublishBusy(true);
                                      setOpsResult(null);
                                      try {
                                        const r = await fetch("/api/versions/rollback", {
                                          method: "POST",
                                          headers: { "content-type": "application/json" },
                                          body: JSON.stringify({ id: v.id, baseHash: publishBaseHash }),
                                        });
                                        const json = await r.json();
                                        if (!json.ok) {
                                          if (json.error === "conflict") {
                                            setOpsResult(`Conflicto: publicación cambió.\nserverHash=${json.serverHash ?? "?"}`);
                                          } else {
                                            setOpsResult(`Error: ${json.error}`);
                                          }
                                        } else {
                                          setOpsResult(`Restore OK: ${json.id}`);
                                          if (typeof json.hash === "string") setPublishBaseHash(json.hash);
                                        }
                                      } catch (e: unknown) {
                                        const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
                                        setOpsResult(`Error: ${message}`);
                                      } finally {
                                        setPublishBusy(false);
                                      }
                                    }}
                                  >
                                    Restaurar
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 text-xs text-white/50">Sin versiones aún (publica al menos una vez).</div>
                      )}
                    </div>
                  </details>

                  <details className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                    <summary className="cursor-pointer text-xs font-semibold text-white/80 select-none">Activity Log</summary>
                    <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">Actividad</div>
                          <div className="mt-1 text-xs text-white/50">Acciones críticas: edición, publish, rollback, media.</div>
                        </div>
                        <button
                          type="button"
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                          disabled={auditBusy}
                          onClick={async () => {
                            setAuditBusy(true);
                            setAuditError(null);
                            try {
                              const r = await fetch("/api/audit?limit=200", { cache: "no-store" });
                              const json = (await r.json()) as { ok?: boolean; entries?: unknown; error?: string };
                              if (!json.ok) throw new Error(json.error || "fetch_failed");
                              setAuditEntries(Array.isArray(json.entries) ? (json.entries as typeof auditEntries) : []);
                            } catch (e: unknown) {
                              const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
                              setAuditError(message);
                            } finally {
                              setAuditBusy(false);
                            }
                          }}
                        >
                          {auditBusy ? "Cargando…" : "Cargar"}
                        </button>
                      </div>

                      {auditError ? (
                        <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-100 whitespace-pre-wrap">
                          {auditError}
                        </div>
                      ) : null}

                      {auditEntries.length ? (
                        <div className="mt-3 space-y-2 max-h-56 overflow-auto">
                          {auditEntries.slice(0, 200).map((a) => (
                            <div key={a.id} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="truncate text-xs font-semibold text-white/85">
                                    {a.action.replace(/_/g, " ")}
                                  </div>
                                  <div className="mt-1 truncate text-[11px] text-white/45">
                                    {new Date(a.at).toLocaleString()} · {a.user}
                                    {a.role ? ` · ${a.role}` : ""}
                                  </div>
                                  {a.detail ? <div className="mt-1 text-[11px] text-white/60">{a.detail}</div> : null}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 text-xs text-white/50">Sin actividad registrada aún.</div>
                      )}
                    </div>
                  </details>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className={cn(
                        "rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-xs font-semibold",
                        (!canPublish || backupsBusy) && "opacity-70"
                      )}
                      disabled={!canPublish || backupsBusy}
                      onClick={async () => {
                        if (!canPublish) return;
                        setBackupsBusy(true);
                        setBackupResult(null);
                        try {
                          const name = window.prompt("Nombre del backup:", `Backup ${new Date().toLocaleString()}`) ?? "";
                          const r = await fetch("/api/site/backup", {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ name: name || "Backup", dump: getDump() }),
                          });
                          const json = await r.json();
                          if (!json.ok) throw new Error(json.error || "backup_failed");
                          setBackupResult(`Backup OK: ${json.id}`);
                        } catch (err: unknown) {
                          const message = err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
                          setBackupResult(`Backup error: ${message}`);
                        } finally {
                          setBackupsBusy(false);
                        }
                      }}
                    >
                      Guardar backup (server)
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition",
                        (!canPublish || backupsBusy) && "opacity-70"
                      )}
                      disabled={!canPublish || backupsBusy}
                      onClick={async () => {
                        if (!canPublish) return;
                        setBackupsBusy(true);
                        setBackupResult(null);
                        try {
                          const r = await fetch("/api/site/backups");
                          const json = await r.json();
                          const list = Array.isArray(json.index?.backups) ? (json.index.backups as typeof backups) : [];
                          setBackups(list);
                        } catch (err: unknown) {
                          const message = err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
                          setBackupResult(`Load error: ${message}`);
                        } finally {
                          setBackupsBusy(false);
                        }
                      }}
                    >
                      {backupsBusy ? "Cargando…" : "Cargar backups"}
                    </button>
                  </div>

                  {backupResult ? (
                    <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70 whitespace-pre-wrap">
                      {backupResult}
                    </div>
                  ) : null}

                  {backups.length ? (
                    <div className="mt-3 space-y-2 max-h-48 overflow-auto">
                      {backups.slice(0, 12).map((b) => (
                        <div key={b.id} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-xs font-semibold text-white/80">{b.name}</div>
                              <div className="truncate text-[11px] text-white/50">
                                {new Date(b.createdAt).toLocaleString()} · {b.user} · {b.id}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition"
                                onClick={async () => {
                                  setBackupsBusy(true);
                                  setBackupResult(null);
                                  try {
                                    const r = await fetch(`/api/site/backups/${encodeURIComponent(b.id)}`);
                                    const json = await r.json();
                                    if (!json.ok) throw new Error(json.error || "fetch_backup_failed");
                                    const dump = json.backup?.dump ?? null;
                                    applyDump(dump);
                                    setBackupResult("Backup cargado al editor (draft).");
                                  } catch (err: unknown) {
                                    const message = err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
                                    setBackupResult(`Load error: ${message}`);
                                  } finally {
                                    setBackupsBusy(false);
                                  }
                                }}
                              >
                                Cargar
                              </button>
                              <button
                                type="button"
                                className={cn(
                                  "rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-[11px] font-semibold",
                                  !canPublish && "opacity-70"
                                )}
                                disabled={!canPublish}
                                onClick={async () => {
                                  const ok = window.confirm("Esto restaurará y PUBLICARÁ el sitio desde este backup. ¿Continuar?");
                                  if (!ok) return;
                                  setBackupsBusy(true);
                                  setBackupResult(null);
                                  try {
	                                    const r = await fetch("/api/site/restore", {
	                                      method: "POST",
	                                      headers: { "content-type": "application/json" },
	                                      body: JSON.stringify({ id: b.id, baseHash: publishBaseHash }),
	                                    });
	                                    const json = await r.json();
	                                    if (!json.ok) {
	                                      if (json.error === "conflict") {
	                                        throw new Error(`conflict (serverHash=${json.serverHash ?? "?"})`);
	                                      }
	                                      throw new Error(json.error || "restore_failed");
	                                    }
	                                    setBackupResult(`Restore OK: ${json.id}`);
	                                  } catch (err: unknown) {
                                    const message = err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
                                    setBackupResult(`Restore error: ${message}`);
                                  } finally {
                                    setBackupsBusy(false);
                                  }
                                }}
                              >
                                Restaurar & Publicar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {!canPublish ? (
                    <div className="mt-3 text-xs text-white/50">Backups server y restore requieren rol `admin` y `CRC_ENABLE_PUBLISH=1`.</div>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Redirecciones</div>
                  <div className="mt-1 text-xs text-white/50">Reglas simples (from → to).</div>

                  <div className="mt-4 space-y-3">
                    {(content.redirects ?? []).map((r, idx) => (
                      <div key={r.id || idx} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <div className="grid grid-cols-1 gap-2">
                          <input
                            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs outline-none text-white/80"
                            value={r.from}
                            onChange={(e) => setContent(`redirects.${idx}.from`, e.target.value)}
                            placeholder="/ruta-antigua"
                          />
                          <input
                            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs outline-none text-white/80"
                            value={r.to}
                            onChange={(e) => setContent(`redirects.${idx}.to`, e.target.value)}
                            placeholder="/ruta-nueva"
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <label className="inline-flex items-center gap-2 text-xs text-white/60">
                            <input
                              type="checkbox"
                              checked={r.enabled}
                              onChange={(e) => setContent(`redirects.${idx}.enabled`, e.target.checked)}
                            />
                            Activa
                          </label>
                          <label className="inline-flex items-center gap-2 text-xs text-white/60">
                            <input
                              type="checkbox"
                              checked={r.permanent}
                              onChange={(e) => setContent(`redirects.${idx}.permanent`, e.target.checked)}
                            />
                            Permanente
                          </label>
                          <button
                            type="button"
                            className="rounded-lg px-2 py-1 text-xs font-semibold text-white/60 hover:text-red-200 hover:bg-white/10 transition"
                            onClick={() => {
                              const next = (content.redirects ?? []).filter((_, i) => i !== idx);
                              setContent("redirects", next);
                            }}
                          >
                            ⌫
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition"
                    onClick={() => {
                      const next = [...(content.redirects ?? [])];
                      next.push({ id: `rd-${Date.now()}`, from: "/", to: "/", permanent: true, enabled: false });
                      setContent("redirects", next);
                    }}
                  >
                    + Redirección
                  </button>
                </div>
                </div>
              </div>
            ) : null}
            {tab === "content" ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Bloques (Inicio)</div>
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
                          {HOME_BLOCK_ADD.map((opt) => (
                            <button
                              key={opt.type}
                              type="button"
                              className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-white/80 hover:bg-white/10 transition"
                              onClick={() => {
                                addBlock("home", opt.type, opt.preset);
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
                      values={homeBlocks}
                      onReorder={(next) => {
                        // Mantiene hero arriba si existe
                        const hero = next.find((b) => b.type === "legacy.hero") ?? null;
                        const others = next.filter((b) => b.type !== "legacy.hero");
                        const locked = hero ? [hero, ...others] : others;
                        reorderBlocks("home", locked);
                      }}
                      className="space-y-2"
                    >
                      {homeBlocks.map((b) => (
                        <Reorder.Item
                          key={b.id}
                          value={b}
                          dragListener={isBlockReorderable(b)}
                          className={cn(
                            "group rounded-xl border px-3 py-2 text-sm",
                            "border-white/10 bg-white/5 hover:bg-white/10 transition",
                            !b.visible && "opacity-50"
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold">{blockTitle(b.type)}</div>
                              <div className="mt-0.5 text-[11px] text-white/50 truncate">
                                {b.type === "legacy.hero" ? "Fijado arriba" : b.locked ? "Bloqueado" : "Arrastrable"}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
                                onClick={() => toggleBlockVisible("home", b.id)}
                                aria-label={b.visible ? "Ocultar bloque" : "Mostrar bloque"}
                              >
                                {b.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </button>
                              <button
                                type="button"
                                className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
                                onClick={() => duplicateBlock("home", b.id)}
                                aria-label="Duplicar bloque"
                                disabled={b.locked}
                              >
                                ⎘
                              </button>
                              <button
                                type="button"
                                className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
                                onClick={() => {
                                  if (b.locked) return;
                                  const ok = window.confirm("¿Eliminar este bloque?");
                                  if (!ok) return;
                                  deleteBlock("home", b.id);
                                }}
                                aria-label="Eliminar bloque"
                                disabled={b.locked}
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

                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">Responsive (texto)</div>
                          <div className="mt-1 text-xs text-white/50">Ajusta para tablet/mobile (container queries).</div>
                        </div>
                        <button
                          type="button"
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                          onClick={() => {
                            const cur = theme.textStyles?.[selectedTextPath] ?? {};
                            const resp = cur.responsive ?? {};
                            setTextStyle(selectedTextPath, { responsive: { ...resp, tablet: undefined, mobile: undefined } });
                          }}
                        >
                          Limpiar
                        </button>
                      </div>

                      <div className="mt-4 space-y-4">
                        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                          <div className="text-xs font-semibold text-white/70">Tablet (≤ 1024px)</div>
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            <label className="text-xs text-white/60">
                              Tamaño (px)
                              <input
                                type="range"
                                min={12}
                                max={96}
                                step={1}
                                value={theme.textStyles?.[selectedTextPath]?.responsive?.tablet?.fontSizePx ?? 18}
                                onChange={(e) => {
                                  const cur = theme.textStyles?.[selectedTextPath] ?? {};
                                  const resp = cur.responsive ?? {};
                                  const next = { ...(resp.tablet ?? {}), fontSizePx: Number(e.target.value) };
                                  setTextStyle(selectedTextPath, { responsive: { ...resp, tablet: next } });
                                }}
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
                                value={theme.textStyles?.[selectedTextPath]?.responsive?.tablet?.fontWeight ?? 600}
                                onChange={(e) => {
                                  const cur = theme.textStyles?.[selectedTextPath] ?? {};
                                  const resp = cur.responsive ?? {};
                                  const next = { ...(resp.tablet ?? {}), fontWeight: Number(e.target.value) };
                                  setTextStyle(selectedTextPath, { responsive: { ...resp, tablet: next } });
                                }}
                                className="mt-2 w-full"
                              />
                            </label>
                          </div>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                          <div className="text-xs font-semibold text-white/70">Mobile (≤ 640px)</div>
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            <label className="text-xs text-white/60">
                              Tamaño (px)
                              <input
                                type="range"
                                min={12}
                                max={96}
                                step={1}
                                value={theme.textStyles?.[selectedTextPath]?.responsive?.mobile?.fontSizePx ?? 18}
                                onChange={(e) => {
                                  const cur = theme.textStyles?.[selectedTextPath] ?? {};
                                  const resp = cur.responsive ?? {};
                                  const next = { ...(resp.mobile ?? {}), fontSizePx: Number(e.target.value) };
                                  setTextStyle(selectedTextPath, { responsive: { ...resp, mobile: next } });
                                }}
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
                                value={theme.textStyles?.[selectedTextPath]?.responsive?.mobile?.fontWeight ?? 600}
                                onChange={(e) => {
                                  const cur = theme.textStyles?.[selectedTextPath] ?? {};
                                  const resp = cur.responsive ?? {};
                                  const next = { ...(resp.mobile ?? {}), fontWeight: Number(e.target.value) };
                                  setTextStyle(selectedTextPath, { responsive: { ...resp, mobile: next } });
                                }}
                                className="mt-2 w-full"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Tema global</div>
                  <div className="mt-1 text-xs text-white/50">Preview en vivo en el canvas.</div>

                  <div className="mt-4">
                    <label className="text-xs text-white/60">Preset (Design System)</label>
                    <select
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                      value={theme.designPreset ?? "custom"}
                      onChange={(e) => {
                        const v = e.target.value as "custom" | "minimal" | "corporate" | "premium";
                        if (v === "custom") {
                          setTheme({ designPreset: "custom" });
                          return;
                        }
                        const preset = getDesignPresetTheme(v);
                        setTheme({ ...preset, designPreset: v });
                      }}
                    >
                      <option value="custom">Custom</option>
                      <option value="minimal">Minimal</option>
                      <option value="corporate">Corporate</option>
                      <option value="premium">Premium</option>
                    </select>
                    <div className="mt-2 text-[11px] text-white/50">
                      Tip: si editas colores manualmente, deja el preset en “Custom”.
                    </div>
                  </div>

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
                      Accent
                      <input
                        type="color"
                        className="mt-2 h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
                        value={theme.accent ?? theme.secondary}
                        onChange={(e) => setTheme({ accent: e.target.value })}
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

                  <details className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                    <summary className="cursor-pointer text-xs font-semibold text-white/80 select-none">
                      Tokens avanzados (spacing / radius / shadow)
                    </summary>
                    <div className="mt-3 space-y-4">
                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <div className="text-xs font-semibold text-white/70">Spacing scale (px)</div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((k) => (
                            <label key={k} className="text-[11px] text-white/60">
                              {k}
                              <input
                                type="number"
                                className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-xs outline-none"
                                value={theme.spacingScale?.[k] ?? 0}
                                onChange={(e) =>
                                  setTheme({
                                    spacingScale: { ...(theme.spacingScale ?? { xs: 8, sm: 12, md: 18, lg: 28, xl: 44, "2xl": 72 }), [k]: Number(e.target.value) },
                                  })
                                }
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <div className="text-xs font-semibold text-white/70">Radius scale (px)</div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {(["sm", "md", "lg", "xl", "pill"] as const).map((k) => (
                            <label key={k} className="text-[11px] text-white/60">
                              {k}
                              <input
                                type="number"
                                className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-xs outline-none"
                                value={theme.radiusScale?.[k] ?? 0}
                                onChange={(e) =>
                                  setTheme({
                                    radiusScale: { ...(theme.radiusScale ?? { sm: 12, md: 16, lg: 20, xl: 28, pill: 999 }), [k]: Number(e.target.value) },
                                  })
                                }
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <div className="text-xs font-semibold text-white/70">Shadow scale (0..1)</div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {(["sm", "md", "lg"] as const).map((k) => (
                            <label key={k} className="text-[11px] text-white/60">
                              {k}
                              <input
                                type="number"
                                step={0.05}
                                min={0}
                                max={1}
                                className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-xs outline-none"
                                value={theme.shadowScale?.[k] ?? 0}
                                onChange={(e) =>
                                  setTheme({
                                    shadowScale: { ...(theme.shadowScale ?? { sm: 0.25, md: 0.6, lg: 1 }), [k]: Number(e.target.value) },
                                  })
                                }
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            ) : null}

            {tab === "media" ? <MediaPanel /> : null}

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
                            Vista pública: /{articlesKind === "columns" ? "pensamiento-critico" : "critica"}/{selectedArticle.id}
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
                      className={cn(
                        "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition",
                        !canPublish && "opacity-60 cursor-not-allowed"
                      )}
                      disabled={!canPublish}
                      onClick={() => {
                        if (!canPublish) return;
                        setPublishOpen(true);
                      }}
                    >
                      Publicar
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {tab === "leads" ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Leads</div>
                      <div className="mt-1 text-xs text-white/50">Mensajes recibidos desde formularios.</div>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                      disabled={leadsBusy}
                      onClick={async () => {
                        if (!canReadLeads) return;
                        setLeadsBusy(true);
                        try {
                          const r = await fetch("/api/leads");
                          const json = (await r.json()) as { ok?: boolean; leads?: unknown };
                          if (json.ok && Array.isArray(json.leads)) setLeads(json.leads as typeof leads);
                        } finally {
                          setLeadsBusy(false);
                        }
                      }}
                    >
                      {leadsBusy ? "Cargando…" : "Recargar"}
                    </button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {!canReadLeads ? (
                      <div className="text-xs text-white/50">Tu rol no tiene permiso para ver leads.</div>
                    ) : null}
                    {leads.length ? (
                      leads.slice(0, 50).map((l) => (
                        <div key={l.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-white/90 truncate">
                                {l.name || "(sin nombre)"} · {l.email || l.phone || "(sin contacto)"}
                              </div>
                              <div className="mt-1 text-[11px] text-white/50 truncate">
                                {new Date(l.createdAt).toLocaleString()} · {l.page} · {l.source}
                              </div>
                            </div>
                            <button
                              type="button"
                              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(
                                    `${l.name}\n${l.email}\n${l.phone}\n${l.page}\n\n${l.message}`.trim()
                                  );
                                } catch {
                                  // ignore
                                }
                              }}
                            >
                              Copiar
                            </button>
                          </div>
                          <div className="mt-3 whitespace-pre-wrap text-sm text-white/75">{l.message}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-white/50">Aún no hay leads.</div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {tab === "access" ? <UsersPanel /> : null}
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 overflow-auto bg-[color:var(--background)] text-[color:var(--foreground)]">
          <DeviceFrame device={device}>
            {selectedPage === "home" ? <HomeCanvas /> : <PageCanvas pageId={selectedPage} />}
          </DeviceFrame>
        </main>
      </div>
    </div>
  );
}
