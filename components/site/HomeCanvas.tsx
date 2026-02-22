"use client";

import { useMemo } from "react";
import { useEditor, usePages } from "@/lib/editor/hooks";
import { BlockCanvas } from "@/components/site/blocks/BlockCanvas";

export function HomeCanvas() {
  const { adminEnabled } = useEditor();
  const { pages } = usePages();

  const home = useMemo(() => pages.find((p) => p.id === "home" || p.slug === "") ?? null, [pages]);
  if (!home) return null;

  return <BlockCanvas page={home} editable={adminEnabled} />;
}

