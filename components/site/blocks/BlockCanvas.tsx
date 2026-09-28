"use client";

import { Fragment, useMemo, type ReactNode } from "react";
import type { SitePage } from "@/lib/editor/types";
import { BlockRenderer } from "@/components/site/blocks/BlockRenderer";
import { ResponsiveStyles } from "@/components/site/blocks/ResponsiveStyles";
import type { CSSProperties } from "react";

export function BlockCanvas({
  page,
  editable,
  afterFirstBlock,
}: {
  page: SitePage;
  editable: boolean;
  afterFirstBlock?: ReactNode;
}) {
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
      {blocks.map((block, index) => (
        <Fragment key={block.id}>
          <BlockRenderer pageId={page.id} block={block} editable={editable} />
          {index === 0 ? afterFirstBlock : null}
        </Fragment>
      ))}
    </div>
  );
}
