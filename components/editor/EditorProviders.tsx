"use client";

import { useEffect } from "react";
import { useContentStore, useThemeStore } from "@/lib/editor/stores";
import { useArticlesStore } from "@/lib/editor/articlesStore";
import { ThemeApplier } from "@/components/editor/ThemeApplier";
import { usePathname } from "next/navigation";
import { usePagesStore } from "@/lib/editor/pagesStore";
import { useTemplatesStore } from "@/lib/editor/templatesStore";
import { usePageTemplatesStore } from "@/lib/editor/pageTemplatesStore";
import { useUndoStore } from "@/lib/editor/undoStore";
import { TextStylesCss } from "@/components/editor/TextStylesCss";

export function EditorProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const isAdminSurface = pathname.startsWith("/admin");
    if (!isAdminSurface) return;

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
