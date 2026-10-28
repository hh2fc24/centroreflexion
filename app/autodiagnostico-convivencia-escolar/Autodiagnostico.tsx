"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Autodiagnóstico de convivencia escolar frente a la Ley 21.809.
 *
 * Doce preguntas en cuatro áreas, tomadas de lo que revisa el diagnóstico de
 * compliance escolar del CRC (protocolos, registros, rutas de decisión y
 * equipo). Todo se calcula en el navegador: no se envía ni guarda nada.
 * Es orientativo; el resultado invita al diagnóstico completo.
 */

type Answer = "si" | "parcial" | "no" | "nose";

const OPTIONS: { value: Answer; label: string; points: number }[] = [
    { value: "si", label: "Sí", points: 2 },
    { value: "parcial", label: "En parte", points: 1 },
    { value: "no", label: "No", points: 0 },
    { value: "nose", label: "No sé", points: 0 },
];

type Area = {
    id: string;
    title: string;
    questions: { id: string; text: string }[];
    advice: string;
};

const AREAS: Area[] = [
    {
        id: "gobernanza",
        title: "Responsables y decisiones",
        questions: [
            { id: "g1", text: "El colegio tiene un encargado o encargada de convivencia designado formalmente y con horas asignadas para ese rol." },
            { id: "g2", text: "Está definido por escrito quién decide en cada tipo de caso y en qué plazo." },
            { id: "g3", text: "El sostenedor o la dirección recibe información periódica sobre los casos de convivencia y su estado." },
        ],
        advice: "Definir quién decide qué, en qué plazo, y cómo llega esa información a la dirección y al sostenedor.",
    },
    {
        id: "protocolos",
        title: "Protocolos y reglamento",
        questions: [
            { id: "p1", text: "El reglamento interno incluye protocolos específicos para acoso, violencia y discriminación." },
            { id: "p2", text: "Los protocolos fijan roles, plazos y criterios de escalamiento que el equipo puede aplicar sin interpretar." },
            { id: "p3", text: "Los protocolos se revisaron y ajustaron después de la publicación de la Ley 21.809." },
        ],
        advice: "Pasar de protocolos declarativos a protocolos operables: roles, plazos y criterios de escalamiento concretos.",
    },
    {
        id: "trazabilidad",
        title: "Registro y trazabilidad",
        questions: [
            { id: "t1", text: "Cada caso queda registrado con la fecha en que se activó el protocolo, las decisiones tomadas y quién las tomó." },
            { id: "t2", text: "Las medidas adoptadas y su seguimiento quedan documentadas hasta el cierre del caso." },
            { id: "t3", text: "Podrían reconstruir completo un caso del año pasado si lo pidiera la Superintendencia o un tribunal." },
        ],
        advice: "Un formato único de registro de decisiones, medidas y seguimiento: lo que no está registrado no se puede demostrar.",
    },
    {
        id: "equipo",
        title: "Equipo y familias",
        questions: [
            { id: "e1", text: "Docentes y asistentes saben qué hacer en los primeros minutos de un episodio de violencia o acoso." },
            { id: "e2", text: "El equipo recibió formación en la aplicación de los protocolos durante el último año." },
            { id: "e3", text: "Existe una vía definida para informar a las familias las medidas adoptadas, y esa comunicación queda registrada." },
        ],
        advice: "Formación práctica sobre casos reales para que el equipo actúe sin improvisar, y una comunicación con familias trazable.",
    },
];

const TOTAL = AREAS.reduce((n, a) => n + a.questions.length, 0);

function levelFor(pct: number) {
    if (pct >= 75) return { label: "Base sólida", text: "El colegio tiene una base de gestión que se puede demostrar. Conviene revisar los puntos en parte o pendientes antes de una fiscalización." };
    if (pct >= 40) return { label: "Brechas por cerrar", text: "Hay elementos en marcha, pero con brechas que hoy serían difíciles de justificar ante una familia, la Superintendencia o un tribunal." };
    return { label: "Exposición alta", text: "Si hoy se judicializa un caso, al colegio le costaría demostrar que actuó con diligencia. Es prioritario ordenar responsables, protocolos y registro." };
}

export function Autodiagnostico() {
    const [answers, setAnswers] = useState<Record<string, Answer>>({});
    const [showResult, setShowResult] = useState(false);

    const answered = Object.keys(answers).length;
    const complete = answered === TOTAL;

    const result = useMemo(() => {
        const points = (a: Answer | undefined) => OPTIONS.find((o) => o.value === a)?.points ?? 0;
        const areas = AREAS.map((area) => {
            const max = area.questions.length * 2;
            const got = area.questions.reduce((n, q) => n + points(answers[q.id]), 0);
            const unknown = area.questions.filter((q) => answers[q.id] === "nose").length;
            return { area, pct: Math.round((got / max) * 100), unknown };
        });
        const pct = Math.round(areas.reduce((n, a) => n + a.pct, 0) / areas.length);
        return { areas, pct, level: levelFor(pct), unknown: areas.reduce((n, a) => n + a.unknown, 0) };
    }, [answers]);

    const reset = () => {
        setAnswers({});
        setShowResult(false);
        window.scrollTo({ top: 0 });
    };

    return (
        <div>
            {/* Progreso: siempre a la vista mientras se responde */}
            <div data-print-hide="" className="sticky top-[72px] z-20 -mx-5 border-b border-[#d8cfc0] bg-[#f8f5ee] px-5 py-3 sm:-mx-8 sm:px-8">
                <div className="flex items-center justify-between gap-4 text-[0.875rem]">
                    <span className="font-semibold tabular-nums text-[#171713]" aria-live="polite">
                        {answered} de {TOTAL} respondidas
                    </span>
                    <span className="text-[#6f675d]">Toma unos 4 minutos · No se guarda nada</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-[#eee8dc]" aria-hidden="true">
                    <div className="h-full rounded-full bg-[#bd6f3c] transition-[width] duration-300" style={{ width: `${(answered / TOTAL) * 100}%` }} />
                </div>
            </div>

            <ol className="mt-8 space-y-12">
                {AREAS.map((area, areaIndex) => (
                    <li key={area.id}>
                        <fieldset>
                            <legend className="crc-serif text-[1.45rem] font-medium leading-[1.2] text-[#171713]">
                                <span className="mr-2 tabular-nums text-[#9f5528]">{areaIndex + 1}.</span>
                                {area.title}
                            </legend>
                            <ul className="mt-5 border-t border-[#d8cfc0]">
                                {area.questions.map((q) => (
                                    <li key={q.id} className="grid gap-3 border-b border-[#d8cfc0] py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-8">
                                        <p id={`${q.id}-text`} className="max-w-[60ch] text-[1rem] leading-[1.6] text-[#171713]">
                                            {q.text}
                                        </p>
                                        <div role="radiogroup" aria-labelledby={`${q.id}-text`} className="flex flex-wrap gap-2">
                                            {OPTIONS.map((opt) => {
                                                const selected = answers[q.id] === opt.value;
                                                return (
                                                    <label
                                                        key={opt.value}
                                                        className={cn(
                                                            "inline-flex min-h-11 min-w-[4.5rem] cursor-pointer items-center justify-center rounded-[6px] border px-3 text-[0.9375rem] font-semibold transition-colors focus-within:ring-2 focus-within:ring-[#171713] focus-within:ring-offset-2",
                                                            selected
                                                                ? "border-[#171713] bg-[#171713] text-[#fffdf8]"
                                                                : "border-[#d8cfc0] bg-[#fffdf8] text-[#171713] hover:border-[#171713]"
                                                        )}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={q.id}
                                                            value={opt.value}
                                                            checked={selected}
                                                            onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))}
                                                            className="sr-only"
                                                        />
                                                        {opt.label}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </fieldset>
                    </li>
                ))}
            </ol>

            <div data-print-hide="" className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
                <button
                    type="button"
                    disabled={!complete}
                    onClick={() => {
                        setShowResult(true);
                        requestAnimationFrame(() => document.getElementById("resultado")?.scrollIntoView({ block: "start" }));
                    }}
                    className="inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-[#bd6f3c] px-5 py-2.5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31] disabled:cursor-not-allowed disabled:bg-[#d8cfc0] disabled:text-[#6f675d]"
                >
                    Ver resultado <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                {!complete ? (
                    <p className="text-[0.9375rem] text-[#6f675d]">
                        Faltan {TOTAL - answered} {TOTAL - answered === 1 ? "pregunta" : "preguntas"}.
                    </p>
                ) : null}
            </div>

            {showResult && complete ? (
                <section id="resultado" aria-labelledby="resultado-title" className="mt-14 scroll-mt-28 rounded-[6px] border border-[#d8cfc0] bg-[#fffdf8] p-6 sm:p-10">
                    <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Resultado orientativo</p>
                    <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                        <h2 id="resultado-title" className="crc-serif text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] text-[#171713]">
                            {result.level.label}
                        </h2>
                        <p className="crc-serif text-[1.6rem] tabular-nums text-[#55574f]">{result.pct} %</p>
                    </div>
                    <p className="mt-4 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">{result.level.text}</p>
                    {result.unknown > 0 ? (
                        <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-[1.6] text-[#55574f]">
                            Respondiste «No sé» en {result.unknown} {result.unknown === 1 ? "pregunta" : "preguntas"}: no saberlo
                            ya es una brecha, porque ante una fiscalización alguien tiene que poder responderlo.
                        </p>
                    ) : null}

                    <ul className="mt-8 border-t border-[#d8cfc0]">
                        {[...result.areas].sort((a, b) => a.pct - b.pct).map(({ area, pct }) => (
                            <li key={area.id} className="grid gap-2 border-b border-[#d8cfc0] py-5 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8">
                                <div>
                                    <p className="font-semibold text-[#171713]">{area.title}</p>
                                    <div className="mt-2 flex items-center gap-3">
                                        <div className="h-1.5 w-28 rounded-full bg-[#eee8dc]" aria-hidden="true">
                                            <div className="h-full rounded-full bg-[#bd6f3c]" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="text-[0.875rem] tabular-nums text-[#55574f]">{pct} %</span>
                                    </div>
                                </div>
                                <p className="text-[0.9375rem] leading-[1.6] text-[#55574f]">
                                    {pct >= 75 ? "Bien encaminado. " : "Prioridad: "}
                                    {area.advice}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-6 max-w-[62ch] text-[0.875rem] leading-[1.6] text-[#6f675d]">
                        Este autodiagnóstico es orientativo y no reemplaza un diagnóstico de cumplimiento ni una asesoría legal.
                    </p>

                    <div data-print-hide="" className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                        <Link
                            href="/instituciones?servicio=compliance-escolar#agenda"
                            className="inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-[#bd6f3c] px-5 py-2.5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31]"
                        >
                            Agendar el diagnóstico completo <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-[#171713] underline decoration-[#bd6f3c] underline-offset-[6px] hover:text-[#9f5528]"
                        >
                            <FileDown className="h-4 w-4" aria-hidden="true" /> Descargar en PDF
                        </button>
                        <button
                            type="button"
                            onClick={reset}
                            className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-[#6f675d] hover:text-[#171713]"
                        >
                            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Empezar de nuevo
                        </button>
                    </div>
                </section>
            ) : null}
        </div>
    );
}
