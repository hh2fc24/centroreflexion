"use client";

import type { SiteBlock } from "@/lib/editor/types";
import { BlockShell } from "@/components/site/blocks/BlockShell";
import { EditableAtom } from "@/components/editor/EditableAtom";
import { usePages } from "@/lib/editor/hooks";
import { cn } from "@/lib/utils";

type FeatureItem = { id: string; title: string; description: string };
type FeaturesData = { title: string; items: FeatureItem[] };

function newId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

export function FeaturesBlock({ pageId, block }: { pageId: string; block: SiteBlock; editable: boolean }) {
  const { updateBlockData } = usePages();
  const data = (block.data ?? {}) as Partial<FeaturesData>;
  const d: FeaturesData = {
    title: data.title ?? "Características",
    items: Array.isArray(data.items) ? (data.items as FeatureItem[]) : [],
  };

  const commit = (next: FeaturesData) => updateBlockData(pageId, block.id, next);

  return (
    <BlockShell block={block}>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-3xl font-semibold tracking-tight font-serif">
          <EditableAtom value={d.title} ariaLabel="Título features" onCommit={(v) => commit({ ...d, title: v })} />
        </h2>
        <button
          type="button"
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          onClick={() =>
            commit({
              ...d,
              items: [...d.items, { id: newId("f"), title: "Nuevo", description: "Describe el beneficio…" }],
            })
          }
        >
          + Item
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {d.items.map((it, idx) => (
          <div
            key={it.id || idx}
            className={cn(
              "rounded-2xl border border-black/10 bg-white p-6",
              block.preset === "bold" && "bg-slate-950 text-white border-white/10"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-lg font-semibold">
                  <EditableAtom
                    value={it.title}
                    ariaLabel="Feature título"
                    onCommit={(v) => {
                      const next = [...d.items];
                      next[idx] = { ...it, title: v };
                      commit({ ...d, items: next });
                    }}
                  />
                </div>
                <div className={cn("mt-2 text-sm text-slate-600", block.preset === "bold" && "text-white/70")}>
                  <EditableAtom
                    value={it.description}
                    ariaLabel="Feature descripción"
                    multiline
                    onCommit={(v) => {
                      const next = [...d.items];
                      next[idx] = { ...it, description: v };
                      commit({ ...d, items: next });
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-black/5 hover:text-red-600 transition",
                  block.preset === "bold" && "text-white/50 hover:bg-white/10"
                )}
                onClick={() => commit({ ...d, items: d.items.filter((_, i) => i !== idx) })}
              >
                ⌫
              </button>
            </div>
          </div>
        ))}
      </div>
    </BlockShell>
  );
}

