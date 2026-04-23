"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Clock3, Mail, Phone, RefreshCw, Users } from "lucide-react";

type PublicRegistration = {
  id: string;
  name: string;
  email: string;
  phone: string;
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

  const metrics = useMemo(() => {
    const withPhone = data.registrations.filter((item) => item.phone && item.phone !== "Sin teléfono").length;
    const withEmail = data.registrations.filter((item) => item.email && item.email !== "Sin correo").length;
    const latest = data.registrations[0]?.createdAt ?? null;
    return { withPhone, withEmail, latest };
  }, [data.registrations]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5f2ea_0%,#efebe2_44%,#f8f4ed_100%)] text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="rounded-[2rem] border border-black/8 bg-white/78 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-700 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                <Activity className="h-3.5 w-3.5" />
                Panel de gestión
              </div>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[3.4rem] font-serif">
                Inscritos al lanzamiento de “Tecnócratas de la infancia”
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
                Vista ejecutiva para seguimiento de inscripciones, contacto con asistentes y gestión posterior del sorteo.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[360px]">
              <MetricCard
                icon={Users}
                label="Total inscritos"
                value={String(data.count)}
                emphasis="dark"
              />
              <MetricCard
                icon={RefreshCw}
                label="Actualización"
                value={loading ? "Sincronizando" : "En vivo"}
                hint="cada 15 segundos"
                spinning={loading}
              />
              <MetricCard
                icon={Phone}
                label="Con teléfono"
                value={String(metrics.withPhone)}
              />
              <MetricCard
                icon={Mail}
                label="Con correo"
                value={String(metrics.withEmail)}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <InfoCard
              icon={Clock3}
              title="Evento"
              text="Miércoles 29 de abril · 18:30 hrs. · Sala A-27 · Alameda 1825"
            />
            <InfoCard
              icon={Activity}
              title="Último registro"
              text={metrics.latest ? formatTimestamp(metrics.latest) : "Sin registros recientes"}
            />
            <InfoCard
              icon={Users}
              title="Uso de esta vista"
              text="Seguimiento interno, contacto con asistentes y control del sorteo."
            />
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-black/8 bg-white shadow-[0_20px_60px_-36px_rgba(15,23,42,0.35)]">
            <div className="flex flex-col gap-2 border-b border-black/8 bg-slate-950 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Base de inscritos</h2>
                <p className="mt-1 text-sm text-slate-400">Nombre, correo, teléfono y hora de registro.</p>
              </div>
              <div className="text-sm text-slate-400">
                {data.count} registro{data.count === 1 ? "" : "s"}
              </div>
            </div>

            {data.registrations.length ? (
              <>
                <div className="hidden grid-cols-[56px_minmax(0,1.25fr)_minmax(0,1fr)_180px_170px] gap-4 border-b border-black/6 bg-slate-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 lg:grid">
                  <div>#</div>
                  <div>Nombre</div>
                  <div>Correo</div>
                  <div>Teléfono</div>
                  <div>Registro</div>
                </div>

                <div className="divide-y divide-black/6">
                  {data.registrations.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid gap-3 px-5 py-4 lg:grid-cols-[56px_minmax(0,1.25fr)_minmax(0,1fr)_180px_170px] lg:items-center lg:gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                          {index + 1}
                        </span>
                        <div className="lg:hidden">
                          <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                          <p className="mt-1 text-sm text-slate-600">{item.email}</p>
                        </div>
                      </div>

                      <div className="hidden lg:block">
                        <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-400">{item.source}</p>
                      </div>

                      <div className="text-sm text-slate-700">{item.email}</div>
                      <div className="text-sm font-medium text-slate-800">{item.phone}</div>
                      <div className="text-sm text-slate-500">{formatTimestamp(item.createdAt)}</div>
                    </div>
                  ))}
                </div>
              </>
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

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  emphasis,
  spinning,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  hint?: string;
  emphasis?: "dark";
  spinning?: boolean;
}) {
  const dark = emphasis === "dark";

  return (
    <div
      className={
        dark
          ? "rounded-2xl border border-black/8 bg-slate-950 px-5 py-4 text-white shadow-[0_16px_40px_-30px_rgba(15,23,42,0.8)]"
          : "rounded-2xl border border-black/8 bg-white px-5 py-4 text-slate-900 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.25)]"
      }
    >
      <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] ${dark ? "text-slate-400" : "text-slate-500"}`}>
        <Icon className={`h-4 w-4 ${spinning ? "animate-spin text-red-700" : dark ? "text-cyan-300" : "text-red-700"}`} />
        {label}
      </div>
      <div className={`mt-2 ${dark ? "text-4xl" : "text-2xl"} font-bold tracking-tight`}>{value}</div>
      {hint ? <div className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>{hint}</div> : null}
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
