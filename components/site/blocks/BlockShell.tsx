"use client";

import type { ResponsiveValue, BlockStyle, SiteBlock } from "@/lib/editor/types";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

function pickStyle(style: ResponsiveValue<BlockStyle>) {
  return style?.base ?? {
    paddingY: 72,
    paddingX: 16,
    maxWidth: 1200,
    background: "transparent",
    textAlign: "left" as const,
    radius: 16,
    shadow: 0.2,
  };
}

export function BlockShell({
  block,
  children,
  className,
}: {
  block: SiteBlock;
  children: React.ReactNode;
  className?: string;
}) {
  const s = pickStyle(block.style);

  return (
    <section
      data-crc-block-id={block.id}
      data-crc-block-type={block.type}
      className={cn("w-full", className)}
      style={
        {
          "--crc-py": `${Math.max(0, s.paddingY)}px`,
          "--crc-px": `${Math.max(0, s.paddingX)}px`,
          "--crc-maxw": `${Math.max(320, s.maxWidth)}px`,
          "--crc-bg": s.background,
          "--crc-align": s.textAlign,
          "--crc-radius": `${Math.max(0, s.radius)}px`,
          "--crc-shadow": `${Math.min(1, Math.max(0, s.shadow ?? 0))}`,
          background: "var(--crc-bg)",
          textAlign: "var(--crc-align)",
          contentVisibility: block.type === "hero" ? "visible" : "auto",
          containIntrinsicSize: block.type === "hero" ? undefined : "1px 900px",
        } as unknown as CSSProperties
      }
    >
      <div
        className="mx-auto"
        style={
          {
            maxWidth: "var(--crc-maxw)",
            padding: "var(--crc-py) var(--crc-px)",
            borderRadius: "var(--crc-radius)",
            boxShadow:
              "0 calc(18px * var(--crc-shadow)) calc(48px * var(--crc-shadow)) rgba(2,6,23, calc(0.15 * var(--crc-shadow)))",
          } as CSSProperties
        }
      >
        {children}
      </div>
    </section>
  );
}
