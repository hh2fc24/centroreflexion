import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BarChart3, Brain, Building2, Check, GraduationCap, HeartHandshake, Mail, Network, Rocket, Scale, ShieldCheck, TrendingUp } from "lucide-react";

const pillars = [
    {
        icon: Brain,
        title: "Consultoría estratégica",
        text: "Asesoría organizacional centrada en salud mental infantil, infancia, programas sociales y modelos de intervención basados en evidencia.",
    },
    {
        icon: HeartHandshake,
        title: "Salud mental e inclusión educativa",
        text: "Estrategias situadas que articulan salud mental, inclusión, trabajo territorial y bienestar tangible para comunidades educativas.",
    },
    {
        icon: Rocket,
        title: "Motor tecnológico",
        text: "Diseño de flujos, CRM, reportería, automatización, inteligencia aplicada y trazabilidad operativa junto a Altius Ignite.",
    },
];

const disciplines = [
    { icon: Brain, title: "Trabajo social y salud mental", tags: ["Evaluación pericial", "Programas sociales", "Infancia y familia"] },
    { icon: HeartHandshake, title: "Terapia ocupacional", tags: ["Inclusión", "Salud mental", "Derechos humanos"] },
    { icon: Scale, title: "Derecho y ciencias jurídicas", tags: ["Familia", "Protección", "Normativa"] },
    { icon: GraduationCap, title: "Sociología y ciencias sociales", tags: ["Diagnóstico", "Investigación", "Territorio"] },
    { icon: TrendingUp, title: "Gestión, BI y transformación digital", tags: ["CRM", "CX", "Automatización"] },
    { icon: Building2, title: "Política pública e institucional", tags: ["Gobernanza", "Evaluación", "Mejora continua"] },
];

const altius = [
    "Automatización de procesos y seguimiento de casos",
    "CRM y arquitectura digital para servicios complejos",
    "Indicadores, reportería ejecutiva y tableros de decisión",
    "IA aplicada a productividad, control y aprendizaje institucional",
];

export default function ConsultoriaPage() {
    return (
        <main className="bg-[#fffdf8] text-[#171713]">
            <section className="relative overflow-hidden border-b border-[#eee8dc] bg-[#171713] py-20 sm:py-28">
                <div className="absolute inset-0 opacity-15">
                    <img src="/images/consulting_hero.png" alt="" className="h-full w-full object-cover mix-blend-luminosity" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#171713]/80 via-[#171713]/92 to-[#171713]" />
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Link href="/servicios" className="inline-flex items-center gap-2 text-sm font-bold text-[#d8d0c4] hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                        Volver a servicios
                    </Link>
                    <div className="mt-8 max-w-4xl">
                        <span className="inline-flex items-center rounded-[5px] bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d8d0c4]">Consultoría institucional</span>
                        <h1 className="mt-7 text-4xl font-bold leading-tight text-white sm:text-5xl font-serif">
                            Ciencias sociales, gestión y tecnología para sostener impacto real.
                        </h1>
                        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#d8d0c4]">
                            Diseñamos, ordenamos e implementamos modelos de intervención, procesos, protocolos y herramientas para instituciones que trabajan con problemas complejos.
                        </p>
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 max-w-3xl">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Tres capas de trabajo</span>
                        <h2 className="mt-4 text-3xl font-bold text-[#171713] font-serif">No solo asesoramos: diseñamos estructura para operar.</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {pillars.map((pillar) => {
                            const Icon = pillar.icon;
                            return (
                                <article key={pillar.title} className="rounded-[8px] border border-[#eee8dc] bg-[#f8f5ee] p-6">
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[6px] bg-[#f4eadf] text-[#bd6f3c]">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold font-serif">{pillar.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-[#70695f]">{pillar.text}</p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] bg-[#fffdf8] py-14 sm:py-20">
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="lg:col-span-5">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Arquitectura estratégica</span>
                        <h2 className="mt-4 text-3xl font-bold leading-tight text-[#171713] font-serif">
                            Convertimos problemas difusos en sistemas de trabajo.
                        </h2>
                        <p className="mt-4 text-base leading-8 text-[#70695f]">
                            La consultoría no queda en un informe: baja a rutas, roles, indicadores, gobernanza y herramientas para que la institución pueda sostener el cambio.
                        </p>
                    </div>
                    <div className="lg:col-span-7">
                        <div className="relative overflow-hidden rounded-[8px] border border-[#eee8dc] shadow-sm">
                            <img src="/images/consultoria_arquitectura_editorial.png" alt="Arquitectura estratégica" className="h-[420px] w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#171713]/55 via-transparent to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] bg-[#f8f5ee] py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 max-w-3xl">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Equipo multidisciplinario</span>
                        <h2 className="mt-4 text-3xl font-bold text-[#171713] font-serif">Problemas que no caben en una sola disciplina.</h2>
                        <p className="mt-4 text-base leading-8 text-[#70695f]">
                            Articulamos clínica, ciencias sociales, salud mental, gestión, tecnología y cumplimiento normativo para que cada intervención tenga profundidad técnica y operación clara.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {disciplines.map((item) => {
                            const Icon = item.icon;
                            return (
                                <article key={item.title} className="rounded-[8px] border border-[#eee8dc] bg-[#fffdf8] p-5">
                                    <Icon className="h-7 w-7 text-[#bd6f3c]" />
                                    <h3 className="mt-4 text-lg font-bold font-serif">{item.title}</h3>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {item.tags.map((tag) => (
                                            <span key={tag} className="rounded-[5px] bg-[#f4eadf] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#9f5528]">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden border-b border-[#34362f] bg-[#0f0d0a] py-14 sm:py-20">
                <div className="absolute inset-0 opacity-20">
                    <img src="/images/pillar_tecnologia.png" alt="" className="h-full w-full object-cover mix-blend-luminosity" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f0d0a] via-[#0f0d0a]/90 to-[#172017]/80" />
                <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="lg:col-span-5">
                        <div className="relative mb-7 h-16 w-40">
                            <Image src="/altius-logo.png" alt="Altius Ignite" fill className="object-contain object-left" />
                        </div>
                        <span className="inline-flex rounded-[5px] border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#d8d0c4]">
                            Partnership tecnológico
                        </span>
                        <h2 className="mt-5 text-3xl font-bold leading-tight text-white font-serif">Metodologías sociales potenciadas por tecnología.</h2>
                        <p className="mt-4 text-base leading-8 text-[#a99f91]">
                            La alianza con Altius Ignite permite transformar modelos, diagnósticos y programas en flujos operables, medibles y escalables.
                        </p>
                        <a href="https://www.altiusignite.com" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-[5px] bg-[#fffdf8] px-5 py-3 text-sm font-bold text-[#171713] hover:bg-[#eee8dc]">
                            Conocer Altius Ignite
                            <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>
                    <div className="grid gap-3 lg:col-span-7">
                        {altius.map((item) => (
                            <div key={item} className="flex items-start gap-3 rounded-[6px] border border-white/10 bg-white/5 px-4 py-4">
                                <Check className="mt-1 h-4 w-4 shrink-0 text-[#d3976d]" />
                                <span className="text-sm font-semibold leading-7 text-[#d8d0c4]">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#f8f5ee] py-14">
                <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
                    {[
                        { icon: ShieldCheck, title: "Criterio técnico", text: "Lectura rigurosa de riesgos, brechas, gobernanza y oportunidades de mejora." },
                        { icon: BarChart3, title: "Trazabilidad", text: "Indicadores, evidencias y reportería para sostener decisiones institucionales." },
                        { icon: Network, title: "Implementación", text: "Procesos, herramientas y acompañamiento para que el diseño llegue a la práctica." },
                    ].map((card) => {
                        const Icon = card.icon;
                        return (
                            <div key={card.title} className="rounded-[8px] border border-[#eee8dc] bg-[#fffdf8] p-6">
                                <Icon className="h-7 w-7 text-[#bd6f3c]" />
                                <h3 className="mt-4 text-xl font-bold font-serif">{card.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-[#70695f]">{card.text}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Link href="/contacto" className="inline-flex items-center gap-2 rounded-[5px] bg-[#171713] px-6 py-3 text-sm font-bold text-white hover:bg-[#34362f]">
                        <Mail className="h-4 w-4" />
                        Solicitar reunión institucional
                    </Link>
                </div>
            </section>
        </main>
    );
}
