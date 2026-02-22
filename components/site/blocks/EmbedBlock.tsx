"use client";

import type { SiteBlock } from "@/lib/editor/types";
import { BlockShell } from "@/components/site/blocks/BlockShell";
import { EditableAtom } from "@/components/editor/EditableAtom";
import { usePages } from "@/lib/editor/hooks";

type EmbedData = { title: string; src: string };

export function EmbedBlock({ pageId, block }: { pageId: string; block: SiteBlock; editable: boolean }) {
  const { updateBlockData } = usePages();
  const data = (block.data ?? {}) as Partial<EmbedData>;
  const d: EmbedData = { title: data.title ?? "Embed", src: data.src ?? "" };

  const commit = (partial: Partial<EmbedData>) => updateBlockData(pageId, block.id, { ...d, ...partial });

  return (
    <BlockShell block={block}>
      <div className="flex items-center justify-between gap-4">
        <div className="text-xl font-semibold font-serif">
          <EditableAtom value={d.title} ariaLabel="Embed título" onCommit={(v) => commit({ title: v })} />
        </div>
      </div>

      <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-black/10 bg-black">
        {d.src ? (
          <iframe
            className="h-full w-full"
            src={d.src}
            title={d.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-sm text-white/70">Pega una URL de embed</div>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-xs font-semibold text-slate-600">
          URL embed
          <input
            className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none"
            value={d.src}
            onChange={(e) => commit({ src: e.target.value })}
            placeholder="https://www.youtube.com/embed/..."
          />
        </label>
      </div>
    </BlockShell>
  );
}

