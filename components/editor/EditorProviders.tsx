"use client";

import { useEffect } from "react";
import { useContentStore, useThemeStore } from "@/lib/editor/stores";
import { useArticlesStore } from "@/lib/editor/articlesStore";
import { ThemeApplier } from "@/components/editor/ThemeApplier";

export function EditorProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useThemeStore.persist.rehydrate();
    void useContentStore.persist.rehydrate();
    void useArticlesStore.persist.rehydrate();
  }, []);

  return (
    <>
      <ThemeApplier />
      {children}
    </>
  );
}
