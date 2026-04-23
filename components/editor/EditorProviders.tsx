"use client";

import { useEffect } from "react";
import { useContentStore, useThemeStore } from "@/lib/editor/stores";
import { useArticlesStore } from "@/lib/editor/articlesStore";
import { ThemeApplier } from "@/components/editor/ThemeApplier";
import { usePathname } from "next/navigation";
import { normalizePagesForStore, usePagesStore } from "@/lib/editor/pagesStore";
import { useTemplatesStore } from "@/lib/editor/templatesStore";
import { usePageTemplatesStore } from "@/lib/editor/pageTemplatesStore";
import { useUndoStore } from "@/lib/editor/undoStore";
import { TextStylesCss } from "@/components/editor/TextStylesCss";
import type { Article } from "@/lib/data";
import type { SiteContent, SitePage, ThemeSettings } from "@/lib/editor/types";

export function EditorProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const isAdminSurface = pathname.startsWith("/admin");
    if (!isAdminSurface) {
      let cancelled = false;

      (async () => {
        try {
          const r = await fetch("/api/public-site", { cache: "no-store" });
          if (!r.ok) return;

          const json = (await r.json()) as {
            ok?: boolean;
            state?: {
              theme?: unknown;
              content?: unknown;
              pages?: unknown;
              articles?: { columns?: unknown; reviews?: unknown } | null;
            };
          };

          if (!json.ok || cancelled) return;

          const state = json.state ?? {};
          const articlesRec = state.articles ?? {};
          const nextColumns = Array.isArray(articlesRec.columns) ? (articlesRec.columns as Article[]) : [];
          const nextReviews = Array.isArray(articlesRec.reviews) ? (articlesRec.reviews as Article[]) : [];
          const nextPages = Array.isArray(state.pages) ? normalizePagesForStore(state.pages as SitePage[]) : [];

          useThemeStore.setState((current) => ({
            ...current,
            theme: (state.theme ?? current.theme) as ThemeSettings,
          }));
          useContentStore.setState((current) => ({
            ...current,
            content: (state.content ?? current.content) as SiteContent,
          }));
          useArticlesStore.setState((current) => ({
            ...current,
            columns: nextColumns,
            reviews: nextReviews,
          }));
          usePagesStore.setState((current) => ({
            ...current,
            pages: nextPages.length ? nextPages : current.pages,
          }));
        } catch {
          // Keep the published snapshot already bundled in the client if the live fetch fails.
        }
      })();

      return () => {
        cancelled = true;
      };
    }

    (async () => {
      await useThemeStore.persist.rehydrate();
      await useContentStore.persist.rehydrate();
      await useArticlesStore.persist.rehydrate();
      await usePagesStore.persist.rehydrate();
      await useTemplatesStore.persist.rehydrate();
      await usePageTemplatesStore.persist.rehydrate();
      useUndoStore.getState().clear();
    })();
  }, [pathname]);

  return (
    <>
      <ThemeApplier />
      <TextStylesCss />
      {children}
    </>
  );
}
