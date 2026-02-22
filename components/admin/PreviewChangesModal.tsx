"use client";

import { useMemo, useState } from "react";
import type { SitePage } from "@/lib/editor/types";
import { cn } from "@/lib/utils";
import { diffPages, type PageDiff } from "@/lib/editor/siteDiff";

type PublishedState = {
  theme: unknown;
  content: unknown;
  pages: SitePage[];
  articles: unknown;
};

const EMPTY_PAGES: SitePage[] = [];

function badgeTone(kind: "added" | "removed" | "modified" | "moved") {
  switch (kind) {
    case "added":
      return "bg-emerald-500/15 text-emerald-100 border-emerald-500/20";
    case "removed":
      return "bg-red-500/15 text-red-100 border-red-500/20";
    case "modified":
      return "bg-amber-500/15 text-amber-100 border-amber-500/20";
    case "moved":
      return "bg-cyan-500/15 text-cyan-100 border-cyan-500/20";
  }
}

export function PreviewChangesModal({
  open,
  busy,
  error,
  draftPages,
  published,
  initialPageId,
  onClose,
}: {
  open: boolean;
  busy: boolean;
  error: string | null;
  draftPages: SitePage[];
  published: PublishedState | null;
  initialPageId: string;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"split" | "toggle">("split");
  const [toggleSide, setToggleSide] = useState<"published" | "draft">("draft");
  const [pageId, setPageId] = useState<string>(initialPageId);

  const publishedPages = published?.pages ?? EMPTY_PAGES;
  const diffs = useMemo(() => diffPages(draftPages ?? [], publishedPages), [draftPages, publishedPages]);

  const selectedDraft = draftPages.find((p) => p.id === pageId) ?? null;
  const selectedPublished = publishedPages.find((p) => p.id === pageId) ?? null;
  const selected: SitePage | null = selectedDraft ?? selectedPublished ?? null;
  const diff: PageDiff | null = diffs.find((d) => d.pageId === pageId) ?? null;

  const changedCount = diffs.filter((d) => d.changed).length;
  const blockChangedCount = diffs.reduce(
    (acc, d) => acc + d.blocks.added.length + d.blocks.removed.length + d.blocks.modified.length + (d.blocks.moved ? 1 : 0),
    0
  );

  const isGlobal = (selected?.kind ?? "page") === "global";
  const slug = selected?.slug ?? "";
  const hasDraft = !!selectedDraft;
  const hasPublished = !!selectedPublished;
  const publicUrl = isGlobal ? "" : slug ? `/${slug}` : "/";
  const draftUrl = selected ? `/admin/preview?pageId=${encodeURIComponent(selected.id)}` : "/admin/preview";

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-6" role="dialog" aria-modal="true">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold">Preview changes</div>
            <div className="mt-1 text-xs text-white/60">
              {busy ? "Cargando publicado…" : error ? "No se pudo cargar el publicado." : changedCount ? `${changedCount} páginas con cambios` : "Sin cambios pendientes"}
              {blockChangedCount ? <span className="text-white/40"> · {blockChangedCount} cambios en bloques</span> : null}
            </div>
          </div>
          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[360px_1fr]">
          <aside className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
            <div className="text-xs font-semibold text-white/70">Página</div>
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm outline-none"
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
            >
              {diffs
                .slice()
                .sort((a, b) => Number(b.changed) - Number(a.changed))
                .map((d) => (
                  <option key={d.pageId} value={d.pageId}>
                    {d.changed ? "● " : ""}
                    {d.title} {d.slug ? `(/${d.slug})` : "(home)"} {d.kind === "global" ? "· global" : ""}
                  </option>
                ))}
            </select>

            <div className="mt-5 flex items-center justify-between gap-2">
              <div className="text-xs font-semibold text-white/70">Vista</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={cn(
                    "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                    mode === "split" ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  )}
                  onClick={() => setMode("split")}
                >
                  Split
                </button>
                <button
                  type="button"
                  className={cn(
                    "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                    mode === "toggle" ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  )}
                  onClick={() => setMode("toggle")}
                >
                  Toggle
                </button>
              </div>
            </div>

            {mode === "toggle" ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={cn(
                    "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                    toggleSide === "published"
                      ? "border-white/15 bg-white/10 text-white"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  )}
                  onClick={() => setToggleSide("published")}
                  disabled={!publicUrl || busy}
                >
                  Publicado
                </button>
                <button
                  type="button"
                  className={cn(
                    "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                    toggleSide === "draft"
                      ? "border-white/15 bg-white/10 text-white"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  )}
                  onClick={() => setToggleSide("draft")}
                >
                  Borrador
                </button>
              </div>
            ) : null}

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-semibold text-white/70">Diferencias</div>
              {busy ? <div className="mt-2 text-xs text-white/50">Calculando…</div> : null}
              {error ? <div className="mt-2 text-xs text-red-200">{error}</div> : null}
              {!busy && !error && diff ? (
                <div className="mt-3 space-y-3">
                  {diff.blocks.added.length ? (
                    <div className="text-xs text-white/80">
                      <span className={cn("inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold", badgeTone("added"))}>
                        +{diff.blocks.added.length} añadidos
                      </span>
                    </div>
                  ) : null}
                  {diff.blocks.removed.length ? (
                    <div className="text-xs text-white/80">
                      <span className={cn("inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold", badgeTone("removed"))}>
                        -{diff.blocks.removed.length} eliminados
                      </span>
                    </div>
                  ) : null}
                  {diff.blocks.modified.length ? (
                    <div className="text-xs text-white/80">
                      <span className={cn("inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold", badgeTone("modified"))}>
                        {diff.blocks.modified.length} modificados
                      </span>
                    </div>
                  ) : null}
                  {diff.blocks.moved ? (
                    <div className="text-xs text-white/80">
                      <span className={cn("inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold", badgeTone("moved"))}>
                        Reordenados
                      </span>
                    </div>
                  ) : null}

                  {!diff.blocks.added.length && !diff.blocks.removed.length && !diff.blocks.modified.length && !diff.blocks.moved ? (
                    <div className="text-xs text-white/50">Sin cambios en bloques para esta página.</div>
                  ) : (
                    <div className="space-y-2">
                      {diff.blocks.added.slice(0, 8).map((b) => (
                        <div key={`a-${b.id}`} className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-white/70 truncate">{b.type}</span>
                          <span className={cn("rounded-full border px-2 py-1 text-[11px] font-semibold", badgeTone("added"))}>Añadido</span>
                        </div>
                      ))}
                      {diff.blocks.removed.slice(0, 8).map((b) => (
                        <div key={`r-${b.id}`} className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-white/70 truncate">{b.type}</span>
                          <span className={cn("rounded-full border px-2 py-1 text-[11px] font-semibold", badgeTone("removed"))}>Eliminado</span>
                        </div>
                      ))}
                      {diff.blocks.modified.slice(0, 8).map((x) => (
                        <div key={`m-${x.after.id}`} className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-white/70 truncate">{x.after.type}</span>
                          <span className={cn("rounded-full border px-2 py-1 text-[11px] font-semibold", badgeTone("modified"))}>Modificado</span>
                        </div>
                      ))}
                      {(diff.blocks.added.length + diff.blocks.removed.length + diff.blocks.modified.length > 8) ? (
                        <div className="text-[11px] text-white/45">Mostrando primeros cambios.</div>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {isGlobal ? (
              <div className="mt-3 text-[11px] text-white/50">Las secciones globales no tienen URL pública directa.</div>
            ) : null}
          </aside>

          <div className="p-5">
            {busy ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="h-[520px] rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
                <div className="h-[520px] rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
              </div>
            ) : (
              <div className={cn(mode === "split" ? "grid grid-cols-1 gap-4 lg:grid-cols-2" : "space-y-3")}>
                {mode === "split" ? (
                  <>
                    <div className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
                      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
                        <div className="text-xs font-semibold text-white/80">Publicado</div>
                        <button
                          type="button"
                          className={cn(
                            "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition",
                            !publicUrl && "opacity-60 cursor-not-allowed"
                          )}
                          disabled={!publicUrl}
                          onClick={() => window.open(publicUrl || "/", "_blank", "noopener,noreferrer")}
                        >
                          Abrir
                        </button>
                      </div>
                      {publicUrl ? (
                        hasPublished ? (
                          <iframe title="Publicado" src={publicUrl} className="h-[520px] w-full bg-white" />
                        ) : (
                          <div className="h-[520px] grid place-items-center text-sm text-white/60">No existe en publicado</div>
                        )
                      ) : (
                        <div className="h-[520px] grid place-items-center text-sm text-white/60">Sin URL</div>
                      )}
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
                      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
                        <div className="text-xs font-semibold text-white/80">Borrador</div>
                        <button
                          type="button"
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition"
                          onClick={() => window.open(draftUrl, "_blank", "noopener,noreferrer")}
                        >
                          Abrir
                        </button>
                      </div>
                      {hasDraft ? (
                        <iframe title="Borrador" src={draftUrl} className="h-[520px] w-full bg-white" />
                      ) : (
                        <div className="h-[520px] grid place-items-center text-sm text-white/60">No existe en borrador</div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
                      <div className="text-xs font-semibold text-white/80">
                        {toggleSide === "published" ? "Publicado" : "Borrador"}
                      </div>
                      <button
                        type="button"
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition"
                        onClick={() => window.open(toggleSide === "published" ? publicUrl || "/" : draftUrl, "_blank", "noopener,noreferrer")}
                      >
                        Abrir
                      </button>
                    </div>
                    {toggleSide === "published" ? (
                      publicUrl ? (
                        hasPublished ? (
                          <iframe title="Publicado" src={publicUrl} className="h-[520px] w-full bg-white" />
                        ) : (
                          <div className="h-[520px] grid place-items-center text-sm text-white/60">No existe en publicado</div>
                        )
                      ) : (
                        <div className="h-[520px] grid place-items-center text-sm text-white/60">Sin URL</div>
                      )
                    ) : (
                      hasDraft ? (
                        <iframe title="Borrador" src={draftUrl} className="h-[520px] w-full bg-white" />
                      ) : (
                        <div className="h-[520px] grid place-items-center text-sm text-white/60">No existe en borrador</div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
