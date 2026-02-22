"use client";

import { ArrowRight } from "lucide-react";
import { BlockShell } from "@/components/site/blocks/BlockShell";
import type { SiteBlock } from "@/lib/editor/types";
import { usePages } from "@/lib/editor/hooks";
import { EditableAtom } from "@/components/editor/EditableAtom";
import { EditorLink } from "@/components/editor/EditorLink";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/site/SafeImage";

export const HERO_VARIANTS = ["centered", "split", "video-bg", "minimal", "bold"] as const;
export type HeroVariant = (typeof HERO_VARIANTS)[number];

function normalizeHeroVariant(input: unknown): HeroVariant {
  const v = typeof input === "string" ? input : "";
  return (HERO_VARIANTS as readonly string[]).includes(v) ? (v as HeroVariant) : "centered";
}

type HeroData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  backgroundImage: string;
  backgroundVideo?: string;
  backgroundVideoPoster?: string;
};

export function HeroBlock({ pageId, block, editable }: { pageId: string; block: SiteBlock; editable: boolean }) {
  const { updateBlockData } = usePages();
  const data = (block.data ?? {}) as Partial<HeroData>;
  const variant = normalizeHeroVariant(block.variant);

  const d: HeroData = {
    eyebrow: data.eyebrow ?? "Nuevo",
    title: data.title ?? "Titular principal",
    subtitle: data.subtitle ?? "Subtítulo claro y directo.",
    primaryCtaLabel: data.primaryCtaLabel ?? "Empezar",
    primaryCtaHref: data.primaryCtaHref ?? "/contacto",
    secondaryCtaLabel: data.secondaryCtaLabel ?? "Saber más",
    secondaryCtaHref: data.secondaryCtaHref ?? "/servicios",
    backgroundImage: data.backgroundImage ?? "/images/library_bg.jpg",
    backgroundVideo: typeof data.backgroundVideo === "string" ? data.backgroundVideo : "",
    backgroundVideoPoster: typeof data.backgroundVideoPoster === "string" ? data.backgroundVideoPoster : "",
  };

  const commit = (partial: Partial<HeroData>) => updateBlockData(pageId, block.id, { ...d, ...partial });

  const preset = block.preset;
  const tone =
    preset === "bold" ? "from-fuchsia-500/25 via-transparent to-cyan-500/25" : "from-cyan-500/18 via-transparent to-indigo-500/18";

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          {variant === "video-bg" && d.backgroundVideo ? (
            <video
              className="h-full w-full object-cover opacity-25"
              src={d.backgroundVideo}
              poster={d.backgroundVideoPoster || undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <SafeImage src={d.backgroundImage} alt="" fill sizes="100vw" className="object-cover opacity-25" />
          )}
        </div>
        <div className={cn("absolute inset-0 bg-gradient-to-br", tone)} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
      </div>

      <BlockShell
        block={block}
        className="relative"
      >
        {variant === "split" ? (
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/85">
                <EditableAtom value={d.eyebrow} ariaLabel="Hero eyebrow" onCommit={(v) => commit({ eyebrow: v })} />
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl font-serif">
                <EditableAtom value={d.title} ariaLabel="Hero title" onCommit={(v) => commit({ title: v })} />
              </h1>

              <p className="mt-5 text-lg text-white/80 sm:text-xl">
                <EditableAtom value={d.subtitle} ariaLabel="Hero subtitle" multiline onCommit={(v) => commit({ subtitle: v })} />
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <EditorLink href={d.primaryCtaHref} className={cn(editable && "pointer-events-auto")}>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90 transition"
                  >
                    <EditableAtom
                      value={d.primaryCtaLabel}
                      ariaLabel="Hero primary CTA"
                      onCommit={(v) => commit({ primaryCtaLabel: v })}
                    />
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </EditorLink>

                <EditorLink href={d.secondaryCtaHref}>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                  >
                    <EditableAtom
                      value={d.secondaryCtaLabel}
                      ariaLabel="Hero secondary CTA"
                      onCommit={(v) => commit({ secondaryCtaLabel: v })}
                    />
                  </button>
                </EditorLink>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-2xl shadow-black/40">
              <div className="relative aspect-[4/3]">
                <SafeImage src={d.backgroundImage} alt="" fill sizes="50vw" className="object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "max-w-4xl",
              (variant === "centered" || variant === "minimal") && "mx-auto text-center",
              variant === "bold" && "max-w-5xl"
            )}
          >
            {variant !== "minimal" ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/85">
                <EditableAtom value={d.eyebrow} ariaLabel="Hero eyebrow" onCommit={(v) => commit({ eyebrow: v })} />
              </div>
            ) : null}

            <h1
              className={cn(
                "mt-6 font-semibold tracking-tight font-serif",
                variant === "minimal" ? "text-3xl sm:text-5xl" : "text-4xl sm:text-6xl",
                variant === "bold" && "sm:text-7xl"
              )}
            >
              <EditableAtom value={d.title} ariaLabel="Hero title" onCommit={(v) => commit({ title: v })} />
            </h1>

            <p className={cn("mt-5 text-white/80", variant === "minimal" ? "text-base sm:text-lg" : "text-lg sm:text-xl")}>
              <EditableAtom value={d.subtitle} ariaLabel="Hero subtitle" multiline onCommit={(v) => commit({ subtitle: v })} />
            </p>

            <div className={cn("mt-8 flex flex-col gap-3 sm:flex-row sm:items-center", (variant === "centered" || variant === "minimal") && "justify-center")}>
              <EditorLink href={d.primaryCtaHref} className={cn(editable && "pointer-events-auto")}>
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center justify-center rounded-full bg-white text-slate-950 hover:bg-white/90 transition font-semibold",
                    variant === "minimal" ? "px-5 py-2.5 text-sm" : "px-6 py-3 text-sm"
                  )}
                >
                  <EditableAtom value={d.primaryCtaLabel} ariaLabel="Hero primary CTA" onCommit={(v) => commit({ primaryCtaLabel: v })} />
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </EditorLink>

              <EditorLink href={d.secondaryCtaHref}>
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 transition font-semibold",
                    variant === "minimal" ? "px-5 py-2.5 text-sm" : "px-6 py-3 text-sm"
                  )}
                >
                  <EditableAtom value={d.secondaryCtaLabel} ariaLabel="Hero secondary CTA" onCommit={(v) => commit({ secondaryCtaLabel: v })} />
                </button>
              </EditorLink>
            </div>
          </div>
        )}
      </BlockShell>
    </section>
  );
}
