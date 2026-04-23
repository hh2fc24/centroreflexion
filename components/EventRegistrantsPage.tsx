"use client";

import { useEffect, useState } from "react";
import { Activity, Clock3, RefreshCw, ShieldCheck, Users } from "lucide-react";

type PublicRegistration = {
  id: string;
  name: string;
  createdAt: number;
  source: string;
};

type Payload = {
  count: number;
  registrations: PublicRegistration[];
};

function formatTimestamp(ts: number) {
  try {
    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Santiago",
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleString();
  }
}

export function EventRegistrantsPage({
  initialCount,
  initialRegistrations,
}: {
  initialCount: number;
  initialRegistrations: PublicRegistration[];
}) {
  const [data, setData] = useState<Payload>({
    count: initialCount,
    registrations: initialRegistrations,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/evento/inscritos?ts=${Date.now()}`, { cache: "no-store" });
        const json = (await response.json()) as { ok?: boolean; count?: number; registrations?: PublicRegistration[] };
        if (!json.ok || cancelled) return;
        setData({
          count: typeof json.count === "number" ? json.count : 0,
          registrations: Array.isArray(json.registrations) ? json.registrations : [],
        });
      } catch {
        // Keep the latest successful state if the refresh fails.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchData();
    const interval = window.setInterval(fetchData, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5f2ea_0%,#eeebe3_45%,#f8f5ef_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="rounded-[2rem] border border-black/8 bg-white/70 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-700 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                <Activity className="h-3.5 w-3.5" />
                Seguimiento en tiempo real
              </div>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl font-serif">
                Inscritos al lanzamiento de “Tecnócratas de la infancia”
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
                Página de seguimiento público de inscripciones web para el evento. Los datos de contacto permanecen reservados.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/8 bg-slate-950 px-5 py-4 text-white shadow-[0_16px_40px_-30px_rgba(15,23,42,0.8)]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  <Users className="h-4 w-4 text-cyan-300" />
                  Total inscritos
                </div>
                <div className="mt-2 text-4xl font-bold tracking-tight">{data.count}</div>
              </div>
              <div className="rounded-2xl border border-black/8 bg-white px-5 py-4 text-slate-900 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.3)]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-red-700" : "text-red-700"}`} />
                  Actualización
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">Cada 15 segundos</div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <InfoCard
              icon={Clock3}
              title="Evento"
              text="Miércoles 29 de abril · 18:30 hrs. · Sala A-27"
            />
            <InfoCard
              icon={ShieldCheck}
              title="Privacidad"
              text="No se publican correos ni teléfonos en esta vista."
            />
            <InfoCard
              icon={Activity}
              title="Fuente"
              text="Inscripciones recibidas desde el formulario web oficial."
            />
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-black/8 bg-white shadow-[0_20px_60px_-36px_rgba(15,23,42,0.35)]">
            <div className="border-b border-black/8 bg-slate-950 px-5 py-4 text-white">
              <h2 className="text-lg font-semibold tracking-tight">Listado de inscritos</h2>
            </div>

            {data.registrations.length ? (
              <div className="divide-y divide-black/6">
                {data.registrations.map((item, index) => (
                  <div key={item.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                          {index + 1}
                        </span>
                        <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">{item.name}</p>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 sm:text-right">
                      {formatTimestamp(item.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                Aún no hay inscripciones registradas para este evento.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Activity;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white/78 p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.25)]">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        <Icon className="h-4 w-4 text-red-700" />
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-700">{text}</p>
    </div>
  );
}
