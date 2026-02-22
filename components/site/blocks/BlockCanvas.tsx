"use client";

import { useMemo } from "react";
import type { SitePage } from "@/lib/editor/types";
import { BlockRenderer } from "@/components/site/blocks/BlockRenderer";
import { ResponsiveStyles } from "@/components/site/blocks/ResponsiveStyles";
import type { CSSProperties } from "react";

export function BlockCanvas({ page, editable }: { page: SitePage; editable: boolean }) {
  const blocks = useMemo(() => page.blocks.filter((b) => b.visible !== false), [page.blocks]);
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        // Enables container queries so responsive overrides can be previewed by resizing the canvas frame in /admin.
        containerType: "inline-size",
      } as unknown as CSSProperties}
    >
      <ResponsiveStyles blocks={page.blocks} />
      {blocks.map((block) => (
        <BlockRenderer key={block.id} pageId={page.id} block={block} editable={editable} />
      ))}
    </div>
  );
}
