"use client";

import { cn } from "@/lib/utils";
import { useContent, useEditor } from "@/lib/editor/hooks";
import { Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import type { Section } from "@/lib/editor/types";

export function SectionChrome({
  section,
  label,
  children,
}: {
  section: Section;
  label: string;
  children: React.ReactNode;
}) {
  const { adminEnabled, selectedSectionId, selectSection } = useEditor();
  const { toggleHomeSection, duplicateHomeSection, deleteHomeSection } = useContent();

  if (!adminEnabled) return <>{children}</>;

  const isSelected = selectedSectionId === section.id;

  return (
    <div
      className={cn(
        "relative",
        isSelected ? "ring-1 ring-[color:var(--primary)]/50" : "ring-1 ring-transparent",
        "transition-colors"
      )}
      onMouseDown={(e) => {
        if (!(e.target instanceof HTMLElement)) return;
        const isEditable = e.target.closest?.("[data-crc-editable='true']");
        if (isEditable) return;
        selectSection(section.id);
      }}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-none",
          "group-hover:ring-1 group-hover:ring-[color:var(--primary)]/20"
        )}
      />

      <div className="absolute left-3 top-3 z-30 flex items-center gap-2">
        <div className="crc-glass pointer-events-auto rounded-full px-3 py-1 text-[11px] font-semibold text-white/90 shadow-sm">
          {label}
        </div>
        <div className="crc-glass pointer-events-auto flex items-center gap-1 rounded-full p-1 shadow-sm">
          <button
            type="button"
            className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label={section.visible ? "Ocultar sección" : "Mostrar sección"}
            onClick={() => toggleHomeSection(section.id)}
          >
            {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label="Duplicar sección"
            onClick={() => duplicateHomeSection(section.id)}
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label="Eliminar sección"
            onClick={() => {
              const ok = window.confirm("¿Eliminar esta sección?");
              if (!ok) return;
              deleteHomeSection(section.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}

