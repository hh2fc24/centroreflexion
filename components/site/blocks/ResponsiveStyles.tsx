"use client";

import type { SiteBlock } from "@/lib/editor/types";

function escAttr(value: string) {
  return value.replace(/"/g, '\\"');
}

export function ResponsiveStyles({ blocks }: { blocks: SiteBlock[] }) {
  const rules: string[] = [];

  for (const b of blocks) {
    const id = b.id;
    const t = b.style?.tablet ?? null;
    const m = b.style?.mobile ?? null;
    const sel = `[data-crc-block-id="${escAttr(id)}"]`;

    {
      const decl: string[] = [];
      if (b.visibleOn?.tablet === false) decl.push("display:none!important;");
      if (t) {
        if (typeof t.paddingY === "number") decl.push(`--crc-py:${t.paddingY}px!important;`);
        if (typeof t.paddingX === "number") decl.push(`--crc-px:${t.paddingX}px!important;`);
        if (typeof t.maxWidth === "number") decl.push(`--crc-maxw:${t.maxWidth}px!important;`);
        if (typeof t.radius === "number") decl.push(`--crc-radius:${t.radius}px!important;`);
        if (typeof t.shadow === "number") decl.push(`--crc-shadow:${t.shadow}!important;`);
        if (typeof t.background === "string") decl.push(`--crc-bg:${t.background}!important;`);
        if (typeof t.textAlign === "string") decl.push(`--crc-align:${t.textAlign}!important;`);
      }
      if (decl.length) rules.push(`@container (max-width: 1024px){${sel}{${decl.join("")}}}`);
    }

    {
      const decl: string[] = [];
      if (b.visibleOn?.mobile === false) decl.push("display:none!important;");
      if (b.visibleOn?.mobile !== false && b.visibleOn?.tablet === false) decl.push("display:block!important;");
      if (m) {
        if (typeof m.paddingY === "number") decl.push(`--crc-py:${m.paddingY}px!important;`);
        if (typeof m.paddingX === "number") decl.push(`--crc-px:${m.paddingX}px!important;`);
        if (typeof m.maxWidth === "number") decl.push(`--crc-maxw:${m.maxWidth}px!important;`);
        if (typeof m.radius === "number") decl.push(`--crc-radius:${m.radius}px!important;`);
        if (typeof m.shadow === "number") decl.push(`--crc-shadow:${m.shadow}!important;`);
        if (typeof m.background === "string") decl.push(`--crc-bg:${m.background}!important;`);
        if (typeof m.textAlign === "string") decl.push(`--crc-align:${m.textAlign}!important;`);
      }
      if (decl.length) rules.push(`@container (max-width: 640px){${sel}{${decl.join("")}}}`);
    }
  }

  if (!rules.length) return null;
  return <style dangerouslySetInnerHTML={{ __html: rules.join("\n") }} />;
}
