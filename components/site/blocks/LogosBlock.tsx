"use client";

import Image from "next/image";
import type { SiteBlock } from "@/lib/editor/types";
import { BlockShell } from "@/components/site/blocks/BlockShell";
import { EditableAtom } from "@/components/editor/EditableAtom";
import { usePages } from "@/lib/editor/hooks";
import { cn } from "@/lib/utils";

type Logo = { id: string; src: string; alt: string };
type LogosData = { title: string; logos: Logo[] };

function newId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

export function LogosBlock({ pageId, block }: { pageId: string; block: SiteBlock; editable: boolean }) {
  const { updateBlockData } = usePages();
  const data = (block.data ?? {}) as Partial<LogosData>;
  const d: LogosData = {
    title: data.title ?? "Confían en nosotros",
    logos: Array.isArray(data.logos) ? (data.logos as Logo[]) : [],
  };

  const commit = (next: LogosData) => updateBlockData(pageId, block.id, next);

  return (
    <BlockShell block={block}>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight font-serif">
          <EditableAtom value={d.title} ariaLabel="Logos título" onCommit={(v) => commit({ ...d, title: v })} />
        </h2>
        <button
          type="button"
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          onClick={() => commit({ ...d, logos: [...d.logos, { id: newId("l"), src: "/images/logo_placeholder.png", alt: "Logo" }] })}
        >
          + Logo
        </button>
      </div>

      <div className={cn("mt-8 grid gap-4", d.logos.length <= 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5")}>
        {d.logos.map((l, idx) => (
          <div
            key={l.id || idx}
            className={cn(
              "rounded-2xl border border-black/10 bg-white p-4 flex items-center justify-center relative",
              block.preset === "bold" && "bg-slate-950 border-white/10"
            )}
          >
            <div className="relative h-12 w-40">
              <Image src={l.src || "/images/logo_placeholder.png"} alt={l.alt || "Logo"} fill className="object-contain" />
            </div>
            <button
              type="button"
              className={cn(
                "absolute right-2 top-2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-black/5 hover:text-red-600 transition",
                block.preset === "bold" && "text-white/50 hover:bg-white/10"
              )}
              onClick={() => commit({ ...d, logos: d.logos.filter((_, i) => i !== idx) })}
              aria-label="Eliminar logo"
            >
              ⌫
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {d.logos.map((l, idx) => (
          <div key={`${l.id}-edit`} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500">Logo {idx + 1}</div>
            <div className="mt-2 space-y-2">
              <label className="block text-xs text-slate-600">
                URL imagen
                <input
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                  value={l.src ?? ""}
                  onChange={(e) => {
                    const next = [...d.logos];
                    next[idx] = { ...l, src: e.target.value };
                    commit({ ...d, logos: next });
                  }}
                />
              </label>
              <label className="block text-xs text-slate-600">
                Alt
                <input
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                  value={l.alt ?? ""}
                  onChange={(e) => {
                    const next = [...d.logos];
                    next[idx] = { ...l, alt: e.target.value };
                    commit({ ...d, logos: next });
                  }}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </BlockShell>
  );
}

