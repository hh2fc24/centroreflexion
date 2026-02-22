"use client";

import type { SiteBlock } from "@/lib/editor/types";
import { BlockShell } from "@/components/site/blocks/BlockShell";
import { usePages } from "@/lib/editor/hooks";

export function SpacerBlock({ pageId, block }: { pageId: string; block: SiteBlock; editable: boolean }) {
  const { updateBlockData } = usePages();
  const data = (block.data ?? {}) as { height?: number };
  const height = Number.isFinite(data.height) ? (data.height as number) : 48;

  return (
    <BlockShell block={block}>
      <div className="w-full" style={{ height }} />
      <div className="mt-2 text-xs text-slate-500">
        Alto:{" "}
        <input
          type="number"
          className="ml-2 w-24 rounded-lg border border-black/10 bg-white px-2 py-1 text-xs"
          value={height}
          onChange={(e) => updateBlockData(pageId, block.id, { height: Number(e.target.value) })}
        />{" "}
        px
      </div>
    </BlockShell>
  );
}

