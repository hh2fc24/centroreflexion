"use client";

import { useMemo } from "react";
import { useTheme } from "@/lib/editor/hooks";

function escAttr(value: string) {
  return value.replace(/"/g, '\\"');
}

export function TextStylesCss() {
  const { theme } = useTheme();

  const css = useMemo(() => {
    const rules: string[] = [];
    const entries = Object.entries(theme.textStyles ?? {});
    for (const [path, override] of entries) {
      const sel = `[data-crc-path="${escAttr(path)}"]`;
      const tablet = override?.responsive?.tablet ?? null;
      const mobile = override?.responsive?.mobile ?? null;

      if (tablet) {
        const decl: string[] = [];
        if (typeof tablet.fontSizePx === "number") decl.push(`font-size:${tablet.fontSizePx}px!important;`);
        if (typeof tablet.fontWeight === "number") decl.push(`font-weight:${tablet.fontWeight}!important;`);
        if (typeof tablet.color === "string") decl.push(`color:${tablet.color}!important;`);
        if (decl.length) rules.push(`@container (max-width: 1024px){${sel}{${decl.join("")}}}`);
      }

      if (mobile) {
        const decl: string[] = [];
        if (typeof mobile.fontSizePx === "number") decl.push(`font-size:${mobile.fontSizePx}px!important;`);
        if (typeof mobile.fontWeight === "number") decl.push(`font-weight:${mobile.fontWeight}!important;`);
        if (typeof mobile.color === "string") decl.push(`color:${mobile.color}!important;`);
        if (decl.length) rules.push(`@container (max-width: 640px){${sel}{${decl.join("")}}}`);
      }
    }
    return rules.join("\n");
  }, [theme.textStyles]);

  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

