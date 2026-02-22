"use client";

import type { DeviceKind } from "@/lib/editor/types";
import { cn } from "@/lib/utils";

const DEVICE_WIDTH: Record<DeviceKind, number> = {
  desktop: 1200,
  tablet: 820,
  mobile: 390,
};

export function DeviceFrame({
  device,
  children,
}: {
  device: DeviceKind;
  children: React.ReactNode;
}) {
  const width = DEVICE_WIDTH[device] ?? DEVICE_WIDTH.desktop;
  return (
    <div className="w-full py-6 px-3">
      <div
        className={cn(
          "mx-auto overflow-hidden",
          "rounded-2xl border border-black/10 bg-white/60 shadow-sm",
          device !== "desktop" && "ring-1 ring-black/5"
        )}
        style={{ maxWidth: width }}
      >
        {children}
      </div>
    </div>
  );
}

