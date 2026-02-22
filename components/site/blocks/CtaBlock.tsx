"use client";

import type { SiteBlock } from "@/lib/editor/types";
import { BlockShell } from "@/components/site/blocks/BlockShell";
import { EditableAtom } from "@/components/editor/EditableAtom";
import { usePages } from "@/lib/editor/hooks";
import { EditorLink } from "@/components/editor/EditorLink";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CtaData = { title: string; subtitle: string; buttonLabel: string; buttonHref: string };

export const CTA_VARIANTS = ["banner", "split", "minimal"] as const;
export type CtaVariant = (typeof CTA_VARIANTS)[number];

function normalizeCtaVariant(input: unknown): CtaVariant {
  const v = typeof input === "string" ? input : "";
  return (CTA_VARIANTS as readonly string[]).includes(v) ? (v as CtaVariant) : "banner";
}

export function CtaBlock({ pageId, block }: { pageId: string; block: SiteBlock; editable: boolean }) {
  const { updateBlockData } = usePages();
  const data = (block.data ?? {}) as Partial<CtaData>;
  const variant = normalizeCtaVariant(block.variant);
  const d: CtaData = {
    title: data.title ?? "Llamado a la acción",
    subtitle: data.subtitle ?? "Un subtítulo convincente.",
    buttonLabel: data.buttonLabel ?? "Contactar",
    buttonHref: data.buttonHref ?? "/contacto",
  };

  const commit = (partial: Partial<CtaData>) => updateBlockData(pageId, block.id, { ...d, ...partial });

  const skin =
    block.preset === "bold"
      ? "bg-slate-950 text-white border-white/10"
      : block.preset === "premium"
        ? "bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border-black/10"
        : "bg-white border-black/10";

  return (
    <BlockShell block={block}>
      <div
        className={cn(
          "rounded-3xl border",
          skin,
          variant === "minimal" ? "p-6 sm:p-7" : "p-8 sm:p-10",
          variant === "split" && "bg-gradient-to-r from-slate-950/15 via-transparent to-cyan-500/10"
        )}
      >
        {variant === "split" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="min-w-0">
              <div className="text-2xl font-semibold tracking-tight font-serif">
                <EditableAtom value={d.title} ariaLabel="CTA título" onCommit={(v) => commit({ title: v })} />
              </div>
              <div className={cn("mt-2 text-sm", block.preset === "bold" ? "text-white/75" : "text-slate-600")}>
                <EditableAtom value={d.subtitle} ariaLabel="CTA subtítulo" multiline onCommit={(v) => commit({ subtitle: v })} />
              </div>
            </div>
            <EditorLink href={d.buttonHref}>
              <button
                type="button"
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition",
                  block.preset === "bold"
                    ? "bg-white text-slate-950 hover:bg-white/90"
                    : "bg-slate-950 text-white hover:bg-slate-900"
                )}
              >
                <EditableAtom value={d.buttonLabel} ariaLabel="CTA botón" onCommit={(v) => commit({ buttonLabel: v })} />
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </EditorLink>
          </div>
        ) : (
          <div className={cn("flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between", variant === "minimal" && "gap-4")}>
            <div className="min-w-0">
              <div className={cn("font-semibold tracking-tight font-serif", variant === "minimal" ? "text-xl" : "text-2xl")}>
                <EditableAtom value={d.title} ariaLabel="CTA título" onCommit={(v) => commit({ title: v })} />
              </div>
              {variant !== "minimal" ? (
                <div className={cn("mt-2 text-sm", block.preset === "bold" ? "text-white/75" : "text-slate-600")}>
                  <EditableAtom value={d.subtitle} ariaLabel="CTA subtítulo" multiline onCommit={(v) => commit({ subtitle: v })} />
                </div>
              ) : null}
            </div>
            <EditorLink href={d.buttonHref}>
              <button
                type="button"
                className={cn(
                  "inline-flex items-center justify-center rounded-full font-semibold transition",
                  variant === "minimal" ? "px-5 py-2.5 text-sm" : "px-6 py-3 text-sm",
                  block.preset === "bold"
                    ? "bg-white text-slate-950 hover:bg-white/90"
                    : "bg-slate-950 text-white hover:bg-slate-900"
                )}
              >
                <EditableAtom value={d.buttonLabel} ariaLabel="CTA botón" onCommit={(v) => commit({ buttonLabel: v })} />
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </EditorLink>
          </div>
        )}
      </div>
    </BlockShell>
  );
}
