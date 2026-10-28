import { cn } from "@/lib/utils";

/**
 * Ilustración de un tablero de seguimiento de casos, hecha en código.
 *
 * Reemplaza la imagen genérica de engranajes: muestra lo que Altius construye
 * para un programa (etapas, responsables, plazos) en vez de una metáfora.
 * Los datos son ficticios y el pie lo dice; no son cifras del CRC.
 */

type Row = { id: string; etapa: string; responsable: string; plazo: string; estado: "al-dia" | "por-vencer" | "vencido" };

const ROWS: Row[] = [
    { id: "C-0142", etapa: "Evaluación inicial", responsable: "Dupla A", plazo: "3 días", estado: "al-dia" },
    { id: "C-0137", etapa: "Plan de intervención", responsable: "Dupla B", plazo: "Hoy", estado: "por-vencer" },
    { id: "C-0129", etapa: "Informe a tribunal", responsable: "Coordinación", plazo: "Vencido 1 día", estado: "vencido" },
    { id: "C-0118", etapa: "Seguimiento", responsable: "Dupla A", plazo: "12 días", estado: "al-dia" },
];

// Solo colores de la paleta CRC; el estado se distingue también por la forma
// (vacío, anillo cobre, lleno cobre), no solo por el color.
const ESTADO: Record<Row["estado"], { label: string; dot: string }> = {
    "al-dia": { label: "Al día", dot: "border border-[#ede7dc]/50" },
    "por-vencer": { label: "Por vencer", dot: "border-2 border-[#e4935d]" },
    vencido: { label: "Vencido", dot: "bg-[#e4935d]" },
};

const ETAPAS = [
    { label: "Ingreso", value: 18 },
    { label: "Evaluación", value: 32 },
    { label: "Intervención", value: 41 },
    { label: "Egreso", value: 9 },
];

export function CaseTrackingPreview({ className }: { className?: string }) {
    const max = Math.max(...ETAPAS.map((e) => e.value));
    return (
        <figure className={cn("w-full", className)}>
            <div className="overflow-hidden rounded-[6px] border border-white/15 bg-[#1d1914] text-[#fbf7ee]">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <p className="text-[0.8125rem] font-semibold">Seguimiento de casos · Programa de ejemplo</p>
                    <p className="text-[0.75rem] tabular-nums text-[#ede7dc]/60">Actualizado hoy, 09:12</p>
                </div>

                <div className="grid gap-px bg-white/10 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                    <div className="bg-[#1d1914] p-4">
                        <p className="text-[0.75rem] text-[#ede7dc]/60">Casos con acción pendiente</p>
                        <ul className="mt-2">
                            {ROWS.map((row) => (
                                <li key={row.id} className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-3 border-t border-white/10 py-2.5 text-[0.8125rem]">
                                    <span className="tabular-nums text-[#ede7dc]/70">{row.id}</span>
                                    <span className="min-w-0">
                                        <span className="block truncate">{row.etapa}</span>
                                        <span className="block truncate text-[0.75rem] text-[#ede7dc]/55">{row.responsable}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-[0.75rem] text-[#ede7dc]/80">
                                        <span className={cn("h-2 w-2 rounded-full", ESTADO[row.estado].dot)} aria-hidden="true" />
                                        <span className="sr-only">{ESTADO[row.estado].label}:</span>
                                        {row.plazo}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-[#1d1914] p-4">
                        <p className="text-[0.75rem] text-[#ede7dc]/60">Casos por etapa</p>
                        <ul className="mt-3 space-y-3">
                            {ETAPAS.map((etapa) => (
                                <li key={etapa.label} className="text-[0.75rem]">
                                    <span className="flex justify-between text-[#ede7dc]/80">
                                        <span>{etapa.label}</span>
                                        <span className="tabular-nums">{etapa.value}</span>
                                    </span>
                                    <span className="mt-1 block h-1.5 rounded-full bg-white/10">
                                        <span
                                            className="block h-full rounded-full bg-[#e4935d]"
                                            style={{ width: `${Math.round((etapa.value / max) * 100)}%` }}
                                        />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <figcaption className="mt-3 text-[0.75rem] leading-[1.5] text-[#ede7dc]/55">
                Ilustración de un tablero de seguimiento. Datos ficticios.
            </figcaption>
        </figure>
    );
}
