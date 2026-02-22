"use client";

import { useMemo } from "react";
import { Copy, Eye, EyeOff, Globe, Link2Off, Lock, Unlock, Trash2 } from "lucide-react";
import type { SiteBlock } from "@/lib/editor/types";
import { cn } from "@/lib/utils";
import { useEditor, usePages } from "@/lib/editor/hooks";

function blockLabel(type: SiteBlock["type"]) {
  switch (type) {
    case "legacy.hero":
      return "Hero (legacy)";
    case "legacy.founders":
      return "Directores (legacy)";
    case "legacy.servicesPreview":
      return "Servicios (legacy)";
    case "legacy.latestArticles":
      return "Lo más reciente (legacy)";
    case "legacy.publications":
      return "Publicaciones (legacy)";
    case "legacy.interviews":
      return "Multimedia (legacy)";
    case "legacy.testimonials":
      return "Opiniones (legacy)";
    case "richText":
      return "Texto";
    case "features":
      return "Features";
    case "cta":
      return "CTA";
    case "pricing":
      return "Pricing";
    case "faq":
      return "FAQ";
    case "logos":
      return "Logos";
    case "spacer":
      return "Espaciador";
    case "embed":
      return "Embed";
    default:
      return type;
  }
}

export function BlockChrome({
  pageId,
  block,
  children,
}: {
  pageId: string;
  block: SiteBlock;
  children: React.ReactNode;
}) {
  const { selectedBlockId, selectBlock } = useEditor();
  const { pages, toggleBlockVisible, duplicateBlock, deleteBlock, setBlockLocked, makeBlockGlobal, detachGlobalRef } = usePages();

  const isSelected = selectedBlockId === block.id;
  const label = useMemo(() => blockLabel(block.type), [block.type]);
  const isGlobalPage = useMemo(() => (pages.find((p) => p.id === pageId)?.kind ?? "page") === "global", [pages, pageId]);

  return (
    <div
      data-crc-block-id={block.id}
      data-crc-block-type={block.type}
      className={cn(
        "relative group",
        isSelected ? "ring-1 ring-[color:var(--primary)]/60" : "ring-1 ring-transparent",
        "transition-colors"
      )}
      onMouseDown={(e) => {
        if (!(e.target instanceof HTMLElement)) return;
        const isEditable = e.target.closest?.("[data-crc-editable='true']");
        if (isEditable) return;
        selectBlock(pageId, block.id);
      }}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          "group-hover:ring-1 group-hover:ring-[color:var(--primary)]/25"
        )}
      />

      <div className="absolute left-3 top-3 z-30 flex items-center gap-2">
        <div className="crc-glass pointer-events-auto rounded-full px-3 py-1 text-[11px] font-semibold text-white/90 shadow-sm">
          {label}
        </div>
        <div className="crc-glass pointer-events-auto flex items-center gap-1 rounded-full p-1 shadow-sm">
          {block.type === "globalRef" ? (
            <button
              type="button"
              className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Desvincular (convertir a local)"
              onClick={() => {
                const ok = window.confirm("¿Desvincular esta sección global y convertirla en bloques locales?");
                if (!ok) return;
                detachGlobalRef(pageId, block.id);
              }}
            >
              <Link2Off className="h-4 w-4" />
            </button>
          ) : null}
          {!isGlobalPage && block.type !== "globalRef" ? (
            <button
              type="button"
              className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10 transition disabled:opacity-40"
              aria-label="Hacer global"
              onClick={() => {
                const name = window.prompt("Nombre de la sección global:", `Global: ${block.type}`) ?? "";
                makeBlockGlobal(pageId, block.id, name || undefined);
              }}
              disabled={block.locked}
            >
              <Globe className="h-4 w-4" />
            </button>
          ) : null}
          <button
            type="button"
            className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label={block.visible ? "Ocultar bloque" : "Mostrar bloque"}
            onClick={() => toggleBlockVisible(pageId, block.id)}
          >
            {block.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label={block.locked ? "Desbloquear bloque" : "Bloquear bloque"}
            onClick={() => setBlockLocked(pageId, block.id, !block.locked)}
          >
            {block.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10 transition disabled:opacity-40"
            aria-label="Duplicar bloque"
            onClick={() => duplicateBlock(pageId, block.id)}
            disabled={block.locked}
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10 transition disabled:opacity-40"
            aria-label="Eliminar bloque"
            onClick={() => {
              if (block.locked) return;
              const ok = window.confirm("¿Eliminar este bloque?");
              if (!ok) return;
              deleteBlock(pageId, block.id);
              selectBlock(null, null);
            }}
            disabled={block.locked}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
