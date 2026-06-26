"use client";

import { useEffect, useState } from "react";
import { Radio } from "lucide-react";

// Martes 30 de junio de 2026, 20:30 hrs. hora continental de Chile (UTC-4, horario de invierno).
const EVENT_TARGET_ISO = "2026-06-30T20:30:00-04:00";

function getRemaining() {
  const diff = new Date(EVENT_TARGET_ISO).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, minutes };
}

export function useDesproteccionCountdown() {
  const [remaining, setRemaining] = useState(() => getRemaining());

  useEffect(() => {
    const interval = window.setInterval(() => setRemaining(getRemaining()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return remaining;
}

export function CountdownStrip({ dark = true }: { dark?: boolean }) {
  const remaining = useDesproteccionCountdown();
  if (!remaining) return null;

  const unitClass = dark
    ? "rounded-xl border border-white/12 bg-white/8 px-2.5 py-2 text-center"
    : "rounded-xl border border-black/10 bg-white px-2.5 py-2 text-center";
  const numberClass = dark ? "text-lg font-bold text-white" : "text-lg font-bold text-slate-950";
  const labelClass = dark ? "text-[10px] uppercase tracking-[0.12em] text-slate-400" : "text-[10px] uppercase tracking-[0.12em] text-slate-500";

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className={unitClass}>
        <div className={numberClass}>{remaining.days}</div>
        <div className={labelClass}>días</div>
      </div>
      <div className={unitClass}>
        <div className={numberClass}>{remaining.hours}</div>
        <div className={labelClass}>horas</div>
      </div>
      <div className={unitClass}>
        <div className={numberClass}>{remaining.minutes}</div>
        <div className={labelClass}>min.</div>
      </div>
    </div>
  );
}

export function LiveStreamBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm ${className}`}
    >
      <Radio className="h-3.5 w-3.5 text-cyan-300" />
      Streaming en vivo
    </div>
  );
}
