"use client";

import { useMemo } from "react";
import { usePages, useEditor } from "@/lib/editor/hooks";
import { BlockCanvas } from "@/components/site/blocks/BlockCanvas";

export function PageCanvas({ pageId }: { pageId: string }) {
  const { pages } = usePages();
  const { adminEnabled } = useEditor();

  const page = useMemo(() => pages.find((p) => p.id === pageId) ?? null, [pages, pageId]);
  if (!page) return null;

  return <BlockCanvas page={page} editable={adminEnabled} />;
}

