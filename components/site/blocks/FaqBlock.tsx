"use client";

import { useState } from "react";
import type { SiteBlock } from "@/lib/editor/types";
import { BlockShell } from "@/components/site/blocks/BlockShell";
import { EditableAtom } from "@/components/editor/EditableAtom";
import { usePages } from "@/lib/editor/hooks";
import { cn } from "@/lib/utils";

type FaqItem = { id: string; q: string; a: string };
type FaqData = { title: string; items: FaqItem[] };

export const FAQ_VARIANTS = ["accordion", "two-column"] as const;
export type FaqVariant = (typeof FAQ_VARIANTS)[number];

function normalizeFaqVariant(input: unknown): FaqVariant {
  const v = typeof input === "string" ? input : "";
  return (FAQ_VARIANTS as readonly string[]).includes(v) ? (v as FaqVariant) : "accordion";
}

function newId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

export function FaqBlock({ pageId, block, editable }: { pageId: string; block: SiteBlock; editable: boolean }) {
  const { updateBlockData } = usePages();
  const data = (block.data ?? {}) as Partial<FaqData>;
  const variant = normalizeFaqVariant(block.variant);
  const d: FaqData = {
    title: data.title ?? "Preguntas frecuentes",
    items: Array.isArray(data.items) ? (data.items as FaqItem[]) : [],
  };

  const commit = (next: FaqData) => updateBlockData(pageId, block.id, next);
  const [openId, setOpenId] = useState<string>(() => d.items[0]?.id || "");
  const effectiveOpenId = editable ? "" : openId || d.items[0]?.id || "";

  return (
    <BlockShell block={block}>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-3xl font-semibold tracking-tight font-serif">
          <EditableAtom value={d.title} ariaLabel="FAQ título" onCommit={(v) => commit({ ...d, title: v })} />
        </h2>
        <button
          type="button"
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          onClick={() =>
            commit({
              ...d,
              items: [...d.items, { id: newId("q"), q: "Nueva pregunta", a: "Respuesta…" }],
            })
          }
        >
          + Pregunta
        </button>
      </div>

      <div className={cn("mt-8", variant === "two-column" ? "grid grid-cols-1 gap-3 md:grid-cols-2" : "space-y-3")}>
        {d.items.map((it, idx) => {
          const isOpen = editable || variant !== "accordion" ? true : effectiveOpenId === it.id;
          return (
            <div
              key={it.id || idx}
              className={cn(
                "rounded-2xl border border-black/10 bg-white p-5 transition",
                block.preset === "bold" && "bg-slate-950 border-white/10 text-white",
                variant === "accordion" && !editable && "cursor-pointer"
              )}
              onClick={() => {
                if (variant !== "accordion" || editable) return;
                setOpenId((cur) => (cur === it.id ? "" : it.id));
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">
                    <EditableAtom
                      value={it.q}
                      ariaLabel="Pregunta"
                      onCommit={(v) => {
                        const next = [...d.items];
                        next[idx] = { ...it, q: v };
                        commit({ ...d, items: next });
                      }}
                    />
                  </div>
                  <div
                    className={cn(
                      "mt-2 text-sm overflow-hidden transition-[max-height,opacity] duration-200",
                      block.preset === "bold" ? "text-white/75" : "text-slate-600",
                      variant === "accordion" && !editable && !isOpen ? "max-h-0 opacity-0" : "max-h-96 opacity-100"
                    )}
                  >
                    <EditableAtom
                      value={it.a}
                      ariaLabel="Respuesta"
                      multiline
                      onCommit={(v) => {
                        const next = [...d.items];
                        next[idx] = { ...it, a: v };
                        commit({ ...d, items: next });
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {variant === "accordion" && !editable ? (
                    <div className={cn("text-xs font-semibold", block.preset === "bold" ? "text-white/50" : "text-slate-400")}>
                      {isOpen ? "—" : "+"}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    className={cn(
                      "rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-black/5 hover:text-red-600 transition",
                      block.preset === "bold" && "text-white/50 hover:bg-white/10"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      commit({ ...d, items: d.items.filter((_, i) => i !== idx) });
                    }}
                    aria-label="Eliminar pregunta"
                  >
                    ⌫
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </BlockShell>
  );
}
