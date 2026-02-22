"use client";

import type { SiteBlock } from "@/lib/editor/types";
import { BlockShell } from "@/components/site/blocks/BlockShell";
import { EditableAtom } from "@/components/editor/EditableAtom";
import { usePages } from "@/lib/editor/hooks";
import { cn } from "@/lib/utils";
import { EditorLink } from "@/components/editor/EditorLink";

type Plan = { id: string; name: string; price: string; note: string; features: string[]; ctaLabel: string; ctaHref: string };
type PricingData = { title: string; plans: Plan[] };

export const PRICING_VARIANTS = ["cards", "table", "highlighted"] as const;
export type PricingVariant = (typeof PRICING_VARIANTS)[number];

function normalizePricingVariant(input: unknown): PricingVariant {
  const v = typeof input === "string" ? input : "";
  return (PRICING_VARIANTS as readonly string[]).includes(v) ? (v as PricingVariant) : "cards";
}

function newId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

export function PricingBlock({ pageId, block }: { pageId: string; block: SiteBlock; editable: boolean }) {
  const { updateBlockData } = usePages();
  const data = (block.data ?? {}) as Partial<PricingData>;
  const d: PricingData = { title: data.title ?? "Planes", plans: Array.isArray(data.plans) ? (data.plans as Plan[]) : [] };
  const variant = normalizePricingVariant(block.variant);

  const commit = (next: PricingData) => updateBlockData(pageId, block.id, next);

  const highlightIdx = d.plans.length >= 2 ? 1 : 0;

  return (
    <BlockShell block={block}>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-3xl font-semibold tracking-tight font-serif">
          <EditableAtom value={d.title} ariaLabel="Pricing título" onCommit={(v) => commit({ ...d, title: v })} />
        </h2>
        <button
          type="button"
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          onClick={() =>
            commit({
              ...d,
              plans: [
                ...d.plans,
                { id: newId("p"), name: "Nuevo plan", price: "$", note: "", features: ["Feature"], ctaLabel: "Elegir", ctaHref: "/contacto" },
              ],
            })
          }
        >
          + Plan
        </button>
      </div>

      {variant === "table" ? (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-black/10 bg-white">
          <table className="min-w-[720px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-black/10 bg-slate-50 text-xs font-semibold text-slate-600">
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Precio</th>
                <th className="px-5 py-3">Nota</th>
                <th className="px-5 py-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {d.plans.map((p, idx) => (
                <tr key={p.id || idx} className="border-b border-black/5 last:border-b-0">
                  <td className="px-5 py-4 align-top">
                    <div className="text-sm font-semibold text-slate-900">
                      <EditableAtom
                        value={p.name}
                        ariaLabel="Plan nombre"
                        onCommit={(v) => {
                          const next = [...d.plans];
                          next[idx] = { ...p, name: v };
                          commit({ ...d, plans: next });
                        }}
                      />
                    </div>
                    <div className="mt-2 space-y-1 text-[13px] text-slate-700">
                      {(p.features ?? []).slice(0, 4).map((f, fi) => (
                        <div key={`${p.id}-${fi}`} className="truncate">
                          •{" "}
                          <EditableAtom
                            value={f}
                            ariaLabel="Feature plan"
                            onCommit={(v) => {
                              const nextPlans = [...d.plans];
                              const nextFeatures = [...(p.features ?? [])];
                              nextFeatures[fi] = v;
                              nextPlans[idx] = { ...p, features: nextFeatures };
                              commit({ ...d, plans: nextPlans });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top text-2xl font-semibold text-slate-950">
                    <EditableAtom
                      value={p.price}
                      ariaLabel="Plan precio"
                      onCommit={(v) => {
                        const next = [...d.plans];
                        next[idx] = { ...p, price: v };
                        commit({ ...d, plans: next });
                      }}
                    />
                  </td>
                  <td className="px-5 py-4 align-top text-sm text-slate-600">
                    <EditableAtom
                      value={p.note}
                      ariaLabel="Plan nota"
                      multiline
                      onCommit={(v) => {
                        const next = [...d.plans];
                        next[idx] = { ...p, note: v };
                        commit({ ...d, plans: next });
                      }}
                    />
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center gap-2">
                      <EditorLink href={p.ctaHref || "/contacto"}>
                        <button
                          type="button"
                          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 transition"
                        >
                          <EditableAtom
                            value={p.ctaLabel ?? "Elegir"}
                            ariaLabel="Plan CTA"
                            onCommit={(v) => {
                              const nextPlans = [...d.plans];
                              nextPlans[idx] = { ...p, ctaLabel: v };
                              commit({ ...d, plans: nextPlans });
                            }}
                          />
                        </button>
                      </EditorLink>
                      <button
                        type="button"
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-black/5 hover:text-red-600 transition"
                        onClick={() => commit({ ...d, plans: d.plans.filter((_, i) => i !== idx) })}
                        aria-label="Eliminar plan"
                      >
                        ⌫
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!d.plans.length ? <div className="p-5 text-sm text-slate-600">Agrega al menos un plan.</div> : null}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {d.plans.map((p, idx) => (
            <div
              key={p.id || idx}
              className={cn(
                "relative rounded-2xl border border-black/10 bg-white p-6",
                block.preset === "premium" && "shadow-lg",
                block.preset === "bold" && "bg-slate-950 text-white border-white/10",
                variant === "highlighted" && idx === highlightIdx && "ring-2 ring-cyan-500/35 border-cyan-500/30 shadow-xl shadow-cyan-500/10"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-lg font-semibold">
                    <EditableAtom
                      value={p.name}
                      ariaLabel="Plan nombre"
                      onCommit={(v) => {
                        const next = [...d.plans];
                        next[idx] = { ...p, name: v };
                        commit({ ...d, plans: next });
                      }}
                    />
                  </div>
                  <div className={cn("mt-2 text-3xl font-semibold", block.preset === "bold" ? "text-white" : "text-slate-950")}>
                    <EditableAtom
                      value={p.price}
                      ariaLabel="Plan precio"
                      onCommit={(v) => {
                        const next = [...d.plans];
                        next[idx] = { ...p, price: v };
                        commit({ ...d, plans: next });
                      }}
                    />
                  </div>
                  <div className={cn("mt-2 text-sm", block.preset === "bold" ? "text-white/70" : "text-slate-600")}>
                    <EditableAtom
                      value={p.note}
                      ariaLabel="Plan nota"
                      multiline
                      onCommit={(v) => {
                        const next = [...d.plans];
                        next[idx] = { ...p, note: v };
                        commit({ ...d, plans: next });
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
                  onClick={() => commit({ ...d, plans: d.plans.filter((_, i) => i !== idx) })}
                  aria-label="Eliminar plan"
                >
                  ⌫
                </button>
              </div>

              <div className="mt-5 space-y-2">
                {(p.features ?? []).map((f, fi) => (
                  <div key={`${p.id}-${fi}`} className={cn("text-sm", block.preset === "bold" ? "text-white/80" : "text-slate-700")}>
                    •{" "}
                    <EditableAtom
                      value={f}
                      ariaLabel="Feature plan"
                      onCommit={(v) => {
                        const nextPlans = [...d.plans];
                        const nextFeatures = [...(p.features ?? [])];
                        nextFeatures[fi] = v;
                        nextPlans[idx] = { ...p, features: nextFeatures };
                        commit({ ...d, plans: nextPlans });
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className={cn(
                    "mt-2 rounded-xl border px-3 py-2 text-xs font-semibold transition w-full",
                    block.preset === "bold"
                      ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      : "border-black/10 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  )}
                  onClick={() => {
                    const nextPlans = [...d.plans];
                    nextPlans[idx] = { ...p, features: [...(p.features ?? []), "Nueva feature"] };
                    commit({ ...d, plans: nextPlans });
                  }}
                >
                  + Feature
                </button>
              </div>

              <div className="mt-6">
                <EditorLink href={p.ctaHref || "/contacto"}>
                  <button
                    type="button"
                    className={cn(
                      "w-full rounded-full px-4 py-3 text-sm font-semibold transition",
                      block.preset === "bold"
                        ? "bg-white text-slate-950 hover:bg-white/90"
                        : "bg-slate-950 text-white hover:bg-slate-900"
                    )}
                  >
                    <EditableAtom
                      value={p.ctaLabel ?? "Elegir"}
                      ariaLabel="Plan CTA"
                      onCommit={(v) => {
                        const nextPlans = [...d.plans];
                        nextPlans[idx] = { ...p, ctaLabel: v };
                        commit({ ...d, plans: nextPlans });
                      }}
                    />
                  </button>
                </EditorLink>
              </div>
            </div>
          ))}
        </div>
      )}
    </BlockShell>
  );
}
