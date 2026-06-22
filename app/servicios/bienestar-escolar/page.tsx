import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, FileWarning, Mail, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "Bienestar Escolar | Convivencia, Protección y Cumplimiento Ley 21.809",
    description:
        "Asesoría en convivencia escolar, protección institucional y cumplimiento de la Ley 21.809 de Convivencia, Buen Trato y Bienestar. Protocolos frente a acoso y maltrato escolar.",
    openGraph: {
        title: "Bienestar escolar CRC: convivencia y protección institucional",
        description:
            "Apoyo técnico para colegios frente a la nueva Ley de Convivencia Escolar: protocolos, planes de convivencia y prevención de bullying.",
    },
};

const system = [
    {
        title: "Bienestar",
        text: "Prevención socioemocional, trabajo con familias y lectura temprana de señales.",
    },
    {
        title: "Convivencia",
        text: "Clima escolar, mediación, conflictos, seguimiento y coordinación interna.",
    },
    {
        title: "Protección",
        text: "Salud mental, riesgo suicida, derivación y contención inicial responsable.",
    },
    {
        title: "Cumplimiento",
        text: "Protocolos aplicables, registros, responsables y preparación frente a fiscalización.",
    },
];

const method = [
    "Diagnóstico institucional",
    "Diseño de criterios y rutas",
    "Entrenamiento del equipo",
    "Seguimiento con evidencia",
];

const questions = [
    "¿Qué hace el colegio cuando un caso supera al equipo habitual?",
    "¿Quién decide, cuándo escala y dónde queda registrada la actuación?",
    "¿Cómo se coordina lo clínico, lo pedagógico, lo normativo y la relación con familias?",
    "¿Qué puede mostrar la institución si el caso llega a fiscalización, prensa o tribunales?",
];

const evidence = [
    {
        stat: "51 UTM",
        title: "Multa confirmada por incumplir protocolos frente a maltrato escolar",
        href: "https://www.diarioconstitucional.cl/2025/09/12/suprema-confirma-multa-de-51-utm-a-colegio-por-incumplir-protocolos-frente-a-maltrato-escolar/",
        source: "Diario Constitucional",
    },
    {
        stat: "$25 millones",
        title: "Indemnización informada por responsabilidad institucional ante bullying",
        href: "https://www.pjud.cl/prensa-y-comunicaciones/noticias-del-poder-judicial/137898",
        source: "Poder Judicial",
    },
    {
        stat: "$55,6 millones",
        title: "Colegio deberá indemnizar por bullying en enseñanza básica",
        href: "https://www.pjud.cl/prensa-y-comunicaciones/noticias-del-poder-judicial/145022",
        source: "Poder Judicial",
    },
];

export default function BienestarEscolarPage() {
    return (
        <main className="bg-[#fffdf8] text-[#171713]">
            <section className="relative overflow-hidden border-b border-[#eee8dc] bg-[#171713]">
                <div className="absolute inset-0">
                    <img src="/images/bienestar-escolar/hero-proteccion-institucional.png" alt="" className="h-full w-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#171713] via-[#171713]/90 to-[#171713]/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171713] via-transparent to-transparent" />

                <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
                    <Link href="/servicios" className="inline-flex items-center gap-2 text-sm font-bold text-[#d8d0c4] hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                        Volver a servicios
                    </Link>

                    <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-end">
                        <div className="lg:col-span-8">
                            <span className="inline-flex items-center rounded-[5px] border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d8d0c4]">
                                Bienestar escolar y protección institucional
                            </span>
                            <h1 className="mt-7 max-w-5xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl font-serif">
                                Gestión experta para colegios que no pueden improvisar frente a una crisis.
                            </h1>
                            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#d8d0c4]">
                                Acompañamiento interdisciplinario para ordenar convivencia, salud mental, protección y cumplimiento, dejando capacidades instaladas en el establecimiento.
                            </p>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="border-y border-white/15 py-6">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d3976d]">Idea central</p>
                                <p className="mt-4 text-2xl font-bold leading-snug text-white font-serif">
                                    El estándar ya no es tener protocolos: es demostrar que la institución supo actuar.
                                </p>
                            </div>
                            <div className="mt-7 flex flex-col gap-3">
                                <Link href="/contacto?servicio=bienestar-escolar" className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#bd6f3c] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#9f5528]">
                                    <Mail className="h-4 w-4" />
                                    Solicitar reunión institucional
                                </Link>
                                <a href="#sistema" className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                                    Ver sistema de trabajo
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] bg-[#fffdf8] py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
                        <div className="lg:col-span-7">
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Contexto del desafío</span>
                            <h2 className="mt-4 max-w-4xl text-3xl font-bold leading-tight text-[#171713] sm:text-5xl font-serif">
                                La gestión escolar quedó en el cruce de salud mental, convivencia, familias y cumplimiento.
                            </h2>
                        </div>
                        <div className="space-y-4 text-base leading-8 text-[#55574f] lg:col-span-5">
                            <p>
                                Los colegios enfrentan casos sensibles con equipos exigidos, marcos normativos en movimiento y comunidades que demandan respuestas rápidas.
                            </p>
                            <p>
                                CRC convierte esa presión en un sistema de actuación: lectura del riesgo, coordinación de roles, criterios compartidos y evidencia para sostener decisiones.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="sistema" className="border-b border-[#eee8dc] bg-[#f8f5ee] py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 max-w-4xl">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Sistema de trabajo</span>
                        <h2 className="mt-4 text-3xl font-bold leading-tight text-[#171713] sm:text-4xl font-serif">
                            No son módulos sueltos. Es una misma gobernanza para responder mejor.
                        </h2>
                    </div>

                    <div className="border-y border-[#ded5c7]">
                        <div className="grid lg:grid-cols-4">
                            {system.map((item, index) => (
                                <article key={item.title} className="relative border-b border-[#ded5c7] py-8 lg:border-b-0 lg:border-r lg:px-6 lg:last:border-r-0">
                                    <span className="text-sm font-bold text-[#bd6f3c]">0{index + 1}</span>
                                    <h3 className="mt-5 text-2xl font-bold leading-tight text-[#171713] font-serif">{item.title}</h3>
                                    <p className="mt-4 text-sm leading-7 text-[#70695f]">{item.text}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden border-b border-[#34362f] bg-[#171713] py-16 sm:py-24">
                <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="lg:col-span-5">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d3976d]">Preguntas críticas</span>
                        <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl font-serif">
                            El servicio empieza donde la respuesta habitual se vuelve insuficiente.
                        </h2>
                    </div>
                    <div className="lg:col-span-7">
                        <div className="divide-y divide-white/10 border-y border-white/10">
                            {questions.map((question) => (
                                <p key={question} className="py-6 text-xl font-bold leading-snug text-[#eee8dc] sm:text-2xl font-serif">
                                    {question}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] bg-[#fffdf8] py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
                        <div className="lg:col-span-5">
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Enfoque de intervención</span>
                            <h2 className="mt-4 text-3xl font-bold leading-tight text-[#171713] sm:text-4xl font-serif">
                                Del diagnóstico al aprendizaje institucional.
                            </h2>
                            <div className="mt-8 overflow-hidden rounded-[8px] border border-[#eee8dc] shadow-sm">
                                <img
                                    src="/images/bienestar-escolar/metodo-trazabilidad.png"
                                    alt=""
                                    className="aspect-[16/10] w-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-7">
                            <div className="relative border-l border-[#bd6f3c] pl-6 sm:pl-10">
                                {method.map((step, index) => (
                                    <div key={step} className="relative pb-10 last:pb-0">
                                        <div className="absolute -left-[34px] top-0 flex h-12 w-12 items-center justify-center rounded-full border border-[#dec0a8] bg-[#fffdf8] text-sm font-bold text-[#bd6f3c] sm:-left-[58px]">
                                            0{index + 1}
                                        </div>
                                        <h3 className="text-2xl font-bold leading-tight text-[#171713] font-serif">{step}</h3>
                                        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#70695f]">
                                            {index === 0 && "Levantamos brechas, capacidades internas, exposición normativa y casos sensibles."}
                                            {index === 1 && "Definimos roles, rutas de actuación, criterios de escalamiento y registro."}
                                            {index === 2 && "Entrenamos al equipo para reconocer señales, coordinar decisiones y actuar bajo presión."}
                                            {index === 3 && "Medimos, revisamos casos y dejamos aprendizaje institucional acumulado."}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] bg-[#f8f5ee] py-16 sm:py-24">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="lg:col-span-4">
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">
                            <FileWarning className="h-4 w-4" />
                            Evidencia pública
                        </span>
                        <h2 className="mt-4 text-3xl font-bold leading-tight text-[#171713] sm:text-4xl font-serif">
                            La exigencia de trazabilidad ya aparece en fallos y prensa.
                        </h2>
                    </div>
                    <div className="lg:col-span-8">
                        <div className="grid gap-4">
                            {evidence.map((item, index) => (
                                <a
                                    key={item.title}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={index === 0 ? "group border-y border-[#bd6f3c] bg-[#fffdf8] px-6 py-7 transition hover:bg-white" : "group border-b border-[#ded5c7] bg-[#fffdf8] px-6 py-6 transition hover:bg-white"}
                                >
                                    <div className="grid gap-4 md:grid-cols-[150px_1fr_160px] md:items-center">
                                        <span className="text-2xl font-bold text-[#9f5528] font-serif">{item.stat}</span>
                                        <div>
                                            <h3 className="text-xl font-bold leading-tight text-[#171713] font-serif">{item.title}</h3>
                                            <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#8a8276]">{item.source}</p>
                                        </div>
                                        <p className="flex items-center text-xs font-bold uppercase tracking-[0.14em] text-[#bd6f3c] md:justify-end">
                                            Ver fuente <ArrowRight className="ml-1 h-3 w-3 transition group-hover:translate-x-1" />
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#fffdf8] py-16 sm:py-24">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="lg:col-span-5">
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">
                            <ShieldCheck className="h-4 w-4" />
                            Resultado esperado
                        </span>
                        <h2 className="mt-4 text-3xl font-bold leading-tight text-[#171713] sm:text-4xl font-serif">
                            Capacidad institucional para responder sin improvisar.
                        </h2>
                    </div>
                    <div className="lg:col-span-7">
                        <div className="grid gap-0 border-y border-[#ded5c7]">
                            {[
                                "Criterios comunes para detectar y priorizar.",
                                "Rutas entendibles para equipos directivos, convivencia y apoyo.",
                                "Registro de decisiones, responsables y seguimiento.",
                                "Un colegio enfocado en educar, con soporte experto para lo complejo.",
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3 border-b border-[#ded5c7] py-5 last:border-b-0">
                                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#bd6f3c]" />
                                    <p className="text-base font-semibold leading-7 text-[#3f423a]">{item}</p>
                                </div>
                            ))}
                        </div>
                        <Link href="/contacto?servicio=bienestar-escolar" className="mt-8 inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#171713] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#34362f]">
                            Contactar al equipo
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
