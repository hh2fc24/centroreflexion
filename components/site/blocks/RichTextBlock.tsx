"use client";

import type { SiteBlock } from "@/lib/editor/types";
import { BlockShell } from "@/components/site/blocks/BlockShell";
import { EditableAtom } from "@/components/editor/EditableAtom";
import { usePages } from "@/lib/editor/hooks";

type RichTextData = { title: string; body: string };

export function RichTextBlock({ pageId, block }: { pageId: string; block: SiteBlock; editable: boolean }) {
  const { updateBlockData } = usePages();
  const data = (block.data ?? {}) as Partial<RichTextData>;
  const d: RichTextData = { title: data.title ?? "Título", body: data.body ?? "Escribe aquí…" };

  const commit = (partial: Partial<RichTextData>) => updateBlockData(pageId, block.id, { ...d, ...partial });

  return (
    <BlockShell block={block}>
      <div className="prose prose-slate max-w-none">
        <h2 className="font-serif">
          <EditableAtom value={d.title} ariaLabel="Título" onCommit={(v) => commit({ title: v })} />
        </h2>
        <p className="whitespace-pre-wrap">
          <EditableAtom value={d.body} ariaLabel="Texto" multiline onCommit={(v) => commit({ body: v })} />
        </p>
      </div>
    </BlockShell>
  );
}

