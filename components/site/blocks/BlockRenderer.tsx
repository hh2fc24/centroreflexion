"use client";

import type { ReactNode } from "react";
import type { SiteBlock } from "@/lib/editor/types";
import { LegacyBlock } from "@/components/site/blocks/LegacyBlock";
import { BlockChrome } from "@/components/editor/BlockChrome";
import { BlockAnimator } from "@/components/site/blocks/BlockAnimator";
import { getBlockDefinition } from "@/components/site/blocks/blockRegistry";

export function BlockRenderer({ pageId, block, editable }: { pageId: string; block: SiteBlock; editable: boolean }) {
  const withChrome = (node: ReactNode) =>
    editable ? (
      <BlockChrome pageId={pageId} block={block}>
        {node}
      </BlockChrome>
    ) : (
      node
    );

  const wrap = (node: ReactNode) =>
    editable ? withChrome(node) : <BlockAnimator block={block}>{node}</BlockAnimator>;

  const def = getBlockDefinition(block.type);
  const Component = def?.Component ?? LegacyBlock;
  return wrap(<Component pageId={pageId} block={block} editable={editable} />);
}
