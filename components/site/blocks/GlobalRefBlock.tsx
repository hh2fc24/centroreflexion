"use client";

import { createContext, useContext, useMemo } from "react";
import type { SiteBlock } from "@/lib/editor/types";
import { useEditor, usePages } from "@/lib/editor/hooks";
import { BlockRenderer } from "@/components/site/blocks/BlockRenderer";
import { ResponsiveStyles } from "@/components/site/blocks/ResponsiveStyles";
import { cn } from "@/lib/utils";

const GlobalStackCtx = createContext<string[]>([]);

export function GlobalRefBlock({ block, editable }: { block: SiteBlock; editable: boolean }) {
  const { selectPage } = useEditor();
  const { pages } = usePages();
  const stack = useContext(GlobalStackCtx);

  const globalPageId = String((block.data as { globalPageId?: string } | null)?.globalPageId ?? "");
  const globalPage = useMemo(
    () => pages.find((p) => p.id === globalPageId && (p.kind ?? "page") === "global") ?? null,
    [pages, globalPageId]
  );

  if (!globalPageId) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-white/80">
        Global ref sin destino.
      </div>
    );
  }

  if (stack.includes(globalPageId)) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-white/80">
        Loop detectado en sección global: {globalPageId}
      </div>
    );
  }

  if (!globalPage) {
    return (
      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-white/80">
        Sección global no encontrada: {globalPageId}
      </div>
    );
  }

  const nextStack = [...stack, globalPageId];

  return (
    <GlobalStackCtx.Provider value={nextStack}>
      <div className="relative">
        {editable ? (
          <div className={cn("px-4 py-2 text-[11px] text-white/55", "border-y border-white/10 bg-black/20")}>
            Global · {globalPage.title}{" "}
            <button
              type="button"
              className="ml-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-white/70 hover:bg-white/10 transition"
              onClick={() => selectPage(globalPage.id)}
            >
              Editar global
            </button>
          </div>
        ) : null}
        <ResponsiveStyles blocks={globalPage.blocks} />
        {globalPage.blocks
          .filter((b) => b.visible !== false)
          .map((b) => (
            <BlockRenderer key={b.id} pageId={globalPage.id} block={b} editable={editable} />
          ))}
      </div>
    </GlobalStackCtx.Provider>
  );
}
