"use client";

import { useEffect, useMemo, useState } from "react";
import { useEditor } from "@/lib/editor/hooks";
import { HomeCanvas } from "@/components/site/HomeCanvas";
import { PageCanvas } from "@/components/site/PageCanvas";
import { useThemeStore, useContentStore } from "@/lib/editor/stores";
import { normalizePagesForStore, usePagesStore } from "@/lib/editor/pagesStore";
import { useArticlesStore } from "@/lib/editor/articlesStore";
import { useTemplatesStore } from "@/lib/editor/templatesStore";
import { usePageTemplatesStore } from "@/lib/editor/pageTemplatesStore";
import type { SiteContent, SitePage, ThemeSettings } from "@/lib/editor/types";
import type { Article } from "@/lib/data";
import type { BlockTemplate } from "@/lib/editor/templatesStore";
import type { PageTemplate } from "@/lib/editor/pageTemplatesStore";

type Snapshot = {
  theme?: unknown;
  content?: unknown;
  pages?: unknown;
  articles?: unknown;
  blockTemplates?: unknown;
  pageTemplates?: unknown;
};

export function VersionPreviewClient({ pageId, versionId }: { pageId: string; versionId: string }) {
  const { setAdminEnabled } = useEditor();
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAdminEnabled(false);
  }, [setAdminEnabled]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      setError(null);
      try {
        const r = await fetch(`/api/versions/${encodeURIComponent(versionId)}`, { cache: "no-store" });
        const json = (await r.json()) as { ok?: boolean; snapshot?: unknown; error?: string };
        if (!json.ok) throw new Error(json.error || "fetch_failed");
        const snapshot = (json.snapshot && typeof json.snapshot === "object" ? (json.snapshot as Snapshot) : {}) as Snapshot;

        const pages = Array.isArray(snapshot.pages) ? (snapshot.pages as SitePage[]) : [];
        const articlesRec = snapshot.articles && typeof snapshot.articles === "object" ? (snapshot.articles as Record<string, unknown>) : {};
        const columns = Array.isArray(articlesRec.columns) ? (articlesRec.columns as Article[]) : [];
        const reviews = Array.isArray(articlesRec.reviews) ? (articlesRec.reviews as Article[]) : [];
        const nextTheme =
          snapshot.theme && typeof snapshot.theme === "object" ? (snapshot.theme as ThemeSettings) : useThemeStore.getState().theme;
        const nextContent =
          snapshot.content && typeof snapshot.content === "object" ? (snapshot.content as SiteContent) : useContentStore.getState().content;
        const nextBlockTemplates = Array.isArray(snapshot.blockTemplates) ? (snapshot.blockTemplates as BlockTemplate[]) : [];
        const nextPageTemplates = Array.isArray(snapshot.pageTemplates) ? (snapshot.pageTemplates as PageTemplate[]) : [];

        if (cancelled) return;
        useThemeStore.setState({ theme: structuredClone(nextTheme), lastChangedAt: 0 }, false);
        useContentStore.setState({ content: structuredClone(nextContent), lastChangedAt: 0 }, false);
        usePagesStore.setState({ pages: normalizePagesForStore(structuredClone(pages)), lastChangedAt: 0 }, false);
        useArticlesStore.setState({ columns: structuredClone(columns), reviews: structuredClone(reviews), lastChangedAt: 0 }, false);
        useTemplatesStore.setState({ blocks: structuredClone(nextBlockTemplates) }, false);
        usePageTemplatesStore.setState({ templates: structuredClone(nextPageTemplates) }, false);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [versionId]);

  const effectivePageId = useMemo(() => pageId || "home", [pageId]);

  if (busy) return <div className="p-6 text-sm text-white/70">Cargando versión…</div>;
  if (error) return <div className="p-6 text-sm text-red-200">No se pudo cargar la versión: {error}</div>;

  if (effectivePageId && effectivePageId !== "home") return <PageCanvas pageId={effectivePageId} />;
  return <HomeCanvas />;
}
