"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SiteBlock } from "@/lib/editor/types";
import type { CSSProperties } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function BlockAnimator({ block, children }: { block: SiteBlock; children: React.ReactNode }) {
  const anim = block.animation;
  const enabled = anim && anim.type && anim.type !== "none";
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  const style = useMemo(() => {
    if (!enabled) return undefined;
    const delay = clamp(Number(anim?.delayMs ?? 0), 0, 5000);
    const duration = clamp(Number(anim?.durationMs ?? 500), 100, 3000);
    const dir = anim?.direction ?? "up";

    let fromX = 0;
    let fromY = 0;
    if (anim?.type === "slide") {
      const d = 20;
      if (dir === "up") fromY = d;
      if (dir === "down") fromY = -d;
      if (dir === "left") fromX = d;
      if (dir === "right") fromX = -d;
    }
    const fromScale = anim?.type === "zoom" ? 0.97 : 1;

    return {
      "--crc-anim-delay": `${delay}ms`,
      "--crc-anim-duration": `${duration}ms`,
      "--crc-anim-from-x": `${fromX}px`,
      "--crc-anim-from-y": `${fromY}px`,
      "--crc-anim-from-scale": `${fromScale}`,
    } as unknown as CSSProperties;
  }, [anim, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const once = anim?.once !== false;
    const io = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some((e) => e.isIntersecting);
        if (anyVisible) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, anim?.once]);

  if (!enabled) return <>{children}</>;

  return (
    <div ref={ref} className={inView ? "crc-anim crc-anim-in" : "crc-anim"} style={style}>
      {children}
    </div>
  );
}

