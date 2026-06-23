"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Count = { value: string; count: number };
type DailyPoint = { date: string; human: number; bot: number; total: number };
type HourlySeriesPoint = { hour: string; human: number; bot: number; total: number };
type HourPoint = { hour: number; count: number };
type ConsentDayPoint = { date: string; accepted: number; rejected: number; rate: number };

type RecentRow = {
  id: string;
  createdAt: string;
  path: string;
  referrer: string | null;
  ip: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  userAgent: string | null;
  device: string | null;
  isBot: boolean;
};

type Summary = {
  totals: {
    pageviews: number;
    human: number;
    bot: number;
    uniqueIps: number;
    consentAccepted: number;
    consentRejected: number;
    conversions: number;
  };
  comparison: {
    humanChangePct: number | null;
    consentRateChangePct: number | null;
    consentRate: number | null;
    previousHuman: number;
  };
  engagement: {
    activeNow: number;
    totalSessions: number;
    bounceRate: number | null;
    avgPagesPerSession: number | null;
    avgSessionDurationSec: number | null;
  };
  topPaths: Count[];
  topCountries: Count[];
  topRegions: Count[];
  topReferrers: Count[];
  topDevices: Count[];
  topUtmSources: Count[];
  topUtmCampaigns: Count[];
  conversionsByEvent: Count[];
  suspiciousNonChileCountries: Count[];
  dailySeries: DailyPoint[];
  hourlySeries: HourlySeriesPoint[];
  hourlyDistribution: HourPoint[];
  consentDailySeries: ConsentDayPoint[];
  recent: RecentRow[];
};

type RangeKey = "6h" | "24h" | "7d" | "30d";

const ACCENT = "#22d3ee";
const ACCENT_SOFT = "rgba(34,211,238,0.18)";
const AMBER = "#f59e0b";
const PALETTE = ["#22d3ee", "#a78bfa", "#f472b6", "#fb923c", "#34d399", "#facc15", "#60a5fa", "#f87171", "#c084fc", "#4ade80"];

function ChangeBadge({ pct }: { pct: number | null }) {
  if (pct === null) {
    return <span className="text-[11px] text-white/40">sin base previa</span>;
  }
  if (pct === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/50">
        <Minus className="h-3 w-3" /> 0%
      </span>
    );
  }
  const up = pct > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-semibold",
        up ? "text-emerald-300" : "text-red-300"
      )}
    >
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {up ? "+" : ""}
      {pct}% vs periodo anterior
    </span>
  );
}

function StatCard({
  label,
  value,
  hint,
  changePct,
}: {
  label: string;
  value: string | number;
  hint?: string;
  changePct?: number | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-white/50">{label}</div>
      <div className="mt-1 text-2xl font-bold text-white">{value}</div>
      {hint ? <div className="mt-1 text-[11px] text-white/40">{hint}</div> : null}
      {changePct !== undefined ? (
        <div className="mt-1">
          <ChangeBadge pct={changePct} />
        </div>
      ) : null}
    </div>
  );
}

function TrendChart({ data, xKey = "date" }: { data: (DailyPoint | HourlySeriesPoint)[]; xKey?: "date" | "hour" }) {
  if (!data.length) return <div className="text-xs text-white/40">Sin datos en este rango.</div>;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="humanFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity={0.45} />
            <stop offset="100%" stopColor={ACCENT} stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="botFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={AMBER} stopOpacity={0.35} />
            <stop offset="100%" stopColor={AMBER} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval={xKey === "hour" ? Math.ceil(data.length / 8) : undefined}
        />
        <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
        <Tooltip
          contentStyle={{ background: "#0b0b0c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
          labelStyle={{ color: "rgba(255,255,255,0.6)" }}
        />
        <Area
          type="monotone"
          dataKey="human"
          name="Humanas"
          stroke={ACCENT}
          fill="url(#humanFill)"
          strokeWidth={2}
          animationDuration={900}
          animationEasing="ease-out"
        />
        <Area
          type="monotone"
          dataKey="bot"
          name="Bots"
          stroke={AMBER}
          fill="url(#botFill)"
          strokeWidth={2}
          animationDuration={900}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function RankedBarChart({ items, height = 200 }: { items: Count[]; height?: number }) {
  if (!items.length) return <div className="text-xs text-white/40">Sin datos en este rango.</div>;
  const data = items.slice(0, 8).map((i) => ({ name: i.value, count: i.count }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
        <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={110}
          tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ background: "#0b0b0c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} animationDuration={800} animationEasing="ease-out">
          {data.map((_, idx) => (
            <Cell key={idx} fill={PALETTE[idx % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function HourlyChart({ data }: { data: HourPoint[] }) {
  if (!data.some((d) => d.count > 0)) return <div className="text-xs text-white/40">Sin datos en este rango.</div>;
  const peak = data.reduce((max, d) => (d.count > max.count ? d : max), data[0]!);
  return (
    <div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="hour"
            tickFormatter={(h: number) => `${h}h`}
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval={1}
          />
          <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
          <Tooltip
            contentStyle={{ background: "#0b0b0c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            labelFormatter={(h: number) => `${h}:00 hrs (Chile)`}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={700} animationEasing="ease-out">
            {data.map((d) => (
              <Cell key={d.hour} fill={d.hour === peak.hour ? ACCENT : "rgba(148,163,184,0.35)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-1 text-[11px] text-white/40">
        Hora con más visitas: <span className="text-cyan-200 font-semibold">{peak.hour}:00 hrs</span> (horario de Chile).
      </div>
    </div>
  );
}

function ConsentRateChart({ data }: { data: ConsentDayPoint[] }) {
  if (!data.length) return <div className="text-xs text-white/40">Sin datos en este rango.</div>;
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(v: number) => `${v}%`}
          tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip
          contentStyle={{ background: "#0b0b0c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
          formatter={(v: number) => [`${v}%`, "Aceptación"]}
        />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="#34d399"
          strokeWidth={2}
          dot={{ r: 3, fill: "#34d399" }}
          animationDuration={900}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

const RANGE_LABEL: Record<RangeKey, string> = {
  "6h": "6 horas",
  "24h": "24 horas",
  "7d": "7 días",
  "30d": "30 días",
};

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export function AnalyticsPanel() {
  const [range, setRange] = useState<RangeKey>("7d");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (r: RangeKey) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/analytics?range=${r}`, { cache: "no-store" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.detail || json.error || "fetch_failed");
      setSummary(json as Summary);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
      setError(message);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    load(range);
  }, [range, load]);

  const totals = summary?.totals;
  const consentTotal = (totals?.consentAccepted ?? 0) + (totals?.consentRejected ?? 0);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Analítica del sitio</div>
            <div className="mt-1 text-xs text-white/50">
              Datos propios registrados en Supabase (pageviews, países, referrers, consentimiento de cookies). No
              depende de Vercel ni de Google Analytics.
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(["6h", "24h", "7d", "30d"] as RangeKey[]).map((r) => (
              <button
                key={r}
                type="button"
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-semibold border transition",
                  range === r
                    ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                )}
                onClick={() => setRange(r)}
              >
                {RANGE_LABEL[r]}
              </button>
            ))}
            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
              disabled={busy}
              onClick={() => load(range)}
            >
              {busy ? "Cargando…" : "Refrescar"}
            </button>
          </div>
        </div>

        {error === "supabase_not_configured" ? (
          <div className="mt-3 text-xs text-amber-200">
            Falta configurar Supabase (service role) en las variables de entorno para guardar analítica.
          </div>
        ) : error ? (
          <div className="mt-3 text-xs text-red-200">Error: {error}</div>
        ) : null}
      </div>

      {summary ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Vistas totales" value={totals!.pageviews} />
            <StatCard
              label="Vistas humanas"
              value={totals!.human}
              changePct={summary.comparison.humanChangePct}
              hint={`Periodo anterior: ${summary.comparison.previousHuman}`}
            />
            <StatCard label="Bots / crawlers" value={totals!.bot} />
            <StatCard label="IPs únicas" value={totals!.uniqueIps} />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <StatCard
              label="Activos ahora"
              value={summary.engagement.activeNow}
              hint="Últimos 5 min"
            />
            <StatCard label="Sesiones" value={summary.engagement.totalSessions} />
            <StatCard
              label="Tasa de rebote"
              value={summary.engagement.bounceRate !== null ? `${summary.engagement.bounceRate}%` : "—"}
              hint="1 sola vista por sesión"
            />
            <StatCard
              label="Páginas / sesión"
              value={summary.engagement.avgPagesPerSession ?? "—"}
            />
            <StatCard
              label="Duración media"
              value={formatDuration(summary.engagement.avgSessionDurationSec)}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs font-semibold text-white/70">Tendencia de visitas</div>
            <div className="mt-1 text-[11px] text-white/40">
              Visitas humanas vs. bots/crawlers{range === "6h" || range === "24h" ? " por hora" : " por día"}. Sirve
              para ver si el tráfico crece y cuánto de ese tráfico es real (no scrapers o monitores).
            </div>
            <div className="mt-2">
              {range === "6h" || range === "24h" ? (
                <TrendChart data={summary.hourlySeries} xKey="hour" />
              ) : (
                <TrendChart data={summary.dailySeries} xKey="date" />
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs font-semibold text-white/70">Horas con más visitas</div>
            <div className="mt-1 text-[11px] text-white/40">
              Distribución de visitas humanas por hora del día (horario de Chile). Útil para saber cuándo publicar
              contenido o programar campañas.
            </div>
            <div className="mt-2">
              <HourlyChart data={summary.hourlyDistribution} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Cookies aceptadas"
              value={totals!.consentAccepted}
              hint={consentTotal ? `${((totals!.consentAccepted / consentTotal) * 100).toFixed(0)}% del total` : undefined}
            />
            <StatCard
              label="Cookies rechazadas"
              value={totals!.consentRejected}
              hint={consentTotal ? `${((totals!.consentRejected / consentTotal) * 100).toFixed(0)}% del total` : undefined}
            />
            <StatCard
              label="Tasa de aceptación"
              value={summary.comparison.consentRate !== null ? `${summary.comparison.consentRate}%` : "—"}
              changePct={summary.comparison.consentRateChangePct}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs font-semibold text-white/70">Evolución de aceptación de cookies</div>
            <div className="mt-1 text-[11px] text-white/40">
              % de visitantes que aceptan cookies cada día. Si baja sostenidamente, puede valer la pena revisar el
              mensaje del banner.
            </div>
            <div className="mt-2">
              <ConsentRateChart data={summary.consentDailySeries} />
            </div>
          </div>

          {summary.suspiciousNonChileCountries.length ? (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="text-xs font-semibold text-amber-200">
                Tráfico humano fuera de Chile (revisar si parece bot/spam)
              </div>
              <div className="mt-1 text-[11px] text-amber-200/60">
                Visitas marcadas como "no bot" pero con IP fuera de Chile. No siempre es malo (puede ser un chileno
                viajando o con VPN), pero si ves volumen alto desde un país inesperado, vale la pena revisar las IPs
                en la tabla de abajo.
              </div>
              <div className="mt-2">
                <RankedBarChart items={summary.suspiciousNonChileCountries} height={Math.min(220, 36 * summary.suspiciousNonChileCountries.length + 40)} />
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-semibold text-white/70">Países</div>
              <div className="mt-2">
                <RankedBarChart items={summary.topCountries} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-semibold text-white/70">Regiones (Chile)</div>
              <div className="mt-2">
                <RankedBarChart items={summary.topRegions} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-semibold text-white/70">Páginas más vistas</div>
              <div className="mt-2">
                <RankedBarChart items={summary.topPaths} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-semibold text-white/70">Referrers</div>
              <div className="mt-2">
                <RankedBarChart items={summary.topReferrers} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-semibold text-white/70">Dispositivos</div>
              <div className="mt-2">
                <RankedBarChart items={summary.topDevices} height={160} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-semibold text-white/70">Campañas (UTM source)</div>
              <div className="mt-1 text-[11px] text-white/40">Solo vistas con utm_source en la URL.</div>
              <div className="mt-2">
                <RankedBarChart items={summary.topUtmSources} height={160} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white/70">Conversiones</div>
                <div className="mt-1 text-[11px] text-white/40">
                  Leads, suscripciones, inscripciones y pagos aprobados registrados en este rango.
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{totals!.conversions}</div>
            </div>
            <div className="mt-3">
              <RankedBarChart items={summary.conversionsByEvent} height={160} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs font-semibold text-white/70">Últimas visitas (detalle con IP)</div>
            <div className="mt-3 max-h-[420px] overflow-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="sticky top-0 bg-[#0b0b0c] text-white/40">
                  <tr>
                    <th className="py-1 pr-2">Fecha</th>
                    <th className="py-1 pr-2">Página</th>
                    <th className="py-1 pr-2">IP</th>
                    <th className="py-1 pr-2">País</th>
                    <th className="py-1 pr-2">Referrer</th>
                    <th className="py-1 pr-2">Dispositivo</th>
                    <th className="py-1 pr-2">Bot</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recent.map((row) => (
                    <tr key={row.id} className={cn("border-t border-white/5", row.isBot && "text-white/30")}>
                      <td className="py-1 pr-2 whitespace-nowrap">{new Date(row.createdAt).toLocaleString()}</td>
                      <td className="py-1 pr-2 max-w-[160px] truncate" title={row.path}>
                        {row.path}
                      </td>
                      <td className="py-1 pr-2 whitespace-nowrap">{row.ip || "—"}</td>
                      <td className="py-1 pr-2 whitespace-nowrap">
                        {row.country || "—"}
                        {row.city ? ` · ${row.city}` : ""}
                      </td>
                      <td className="py-1 pr-2 max-w-[160px] truncate" title={row.referrer || ""}>
                        {row.referrer || "directo"}
                      </td>
                      <td className="py-1 pr-2 whitespace-nowrap">{row.device || "—"}</td>
                      <td className="py-1 pr-2 whitespace-nowrap">{row.isBot ? "sí" : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!summary.recent.length ? <div className="mt-3 text-xs text-white/40">Sin visitas registradas aún.</div> : null}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
