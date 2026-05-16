import Link from "next/link";
import { ArrowRight, Brain, Check, ClipboardCheck, HeartHandshake, Mail, Network, Scale, ShieldCheck, Users } from "lucide-react";

const modules = [
    {
        icon: HeartHandshake,
        title: "Bienestar socioemocional",
        text: "Diseño de acciones formativas, regulación emocional, trabajo con familias y fortalecimiento de habilidades base para comunidades educativas.",
    },
    {
        icon: Users,
        title: "Convivencia escolar",
        text: "Apoyo en clima, mediación, resolución pacífica de conflictos, seguimiento de casos y criterios de actuación compartidos por los equipos.",
    },
    {
        icon: Brain,
        title: "Salud mental y riesgo suicida",
        text: "Criterios de detección temprana, contención inicial, orientación de derivaciones y activación responsable de redes externas.",
    },
    {
        icon: Scale,
        title: "Cumplimiento y trazabilidad",
        text: "Revisión documental, actualización de protocolos, orden de evidencias y preparación institucional frente a exigencias normativas.",
    },
];

const method = [
    "Diagnóstico clínico, normativo y operativo del establecimiento.",
    "Priorización de brechas y diseño del modelo de acompañamiento.",
    "Capacitación, protocolos, rutas de derivación y soporte al equipo interno.",
    "Seguimiento con indicadores, trazabilidad de casos y mejora continua.",
];

const roles = [
    "Clínica y salud mental infanto-juvenil",
    "Terapia ocupacional e inclusión educativa",
    "Ciencias sociales, infancia y familia",
    "Cumplimiento, gestión y protocolos",
    "Datos, automatización y soporte tecnológico",
];

export default function BienestarEscolarPage() {
    return (
        <main className="bg-[#fffdf8] text-[#171713]">
            <section className="relative overflow-hidden border-b border-[#eee8dc] bg-[#171713] py-20 sm:py-28">
                <div className="absolute inset-0 opacity-20">
                    <img src="/images/consulting_hero.png" alt="" className="h-full w-full object-cover mix-blend-luminosity" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#171713]/70 via-[#171713]/90 to-[#171713]" />
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl">
                        <span className="inline-flex items-center rounded-[5px] border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d8d0c4]">
                            Producto en desarrollo para colegios
                        </span>
                        <h1 className="mt-7 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl font-serif">
                            Bienestar, convivencia y cumplimiento escolar con soporte experto.
                        </h1>
                        <p className="mt-7 max-w-3xl text-lg leading-8 text-[#d8d0c4]">
                            Un modelo de acompañamiento interdisciplinario para establecimientos educacionales que necesitan ordenar su gestión preventiva, responder mejor ante situaciones críticas y fortalecer capacidades internas sin desviar al colegio de su tarea central: educar.
                        </p>
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/contacto"
                                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#bd6f3c] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#9f5528]"
                            >
                                <Mail className="h-4 w-4" />
                                Solicitar diagnóstico inicial
                            </Link>
                            <Link
                                href="/servicios"
                                className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
                            >
                                Volver a servicios
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] py-14 sm:py-20">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="lg:col-span-5">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">La idea central</span>
                        <h2 className="mt-4 text-3xl font-bold leading-tight text-[#171713] sm:text-4xl font-serif">
                            Que el colegio no tenga que improvisar frente a lo complejo.
                        </h2>
                    </div>
                    <div className="space-y-5 text-base leading-8 text-[#55574f] lg:col-span-7">
                        <p>
                            Muchos colegios tienen protocolos, equipos comprometidos y voluntad de actuar bien, pero la presión cotidiana suele dejar la gestión del bienestar fragmentada: casos sensibles, convivencia, salud mental, exigencias legales, familias, derivaciones y registro de decisiones conviven sin una arquitectura común.
                        </p>
                        <p>
                            CRC propone construir una capa de soporte externo que combine criterio clínico, lectura psicosocial, cumplimiento, operación y tecnología. El objetivo no es reemplazar al colegio, sino darle estructura, trazabilidad y respaldo para que sus equipos puedan actuar con mayor claridad.
                        </p>
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] bg-[#f8f5ee] py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 max-w-3xl">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Módulos del servicio</span>
                        <h2 className="mt-4 text-3xl font-bold text-[#171713] sm:text-4xl font-serif">
                            Un marco modular para crecer sin llenar la página de ruido.
                        </h2>
                        <p className="mt-4 text-base leading-8 text-[#70695f]">
                            Cada módulo puede desarrollarse como contenido, guía, caso o componente comercial independiente a medida que el producto madure.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {modules.map((item) => {
                            const Icon = item.icon;
                            return (
                                <article key={item.title} className="rounded-[8px] border border-[#eee8dc] bg-[#fffdf8] p-6 shadow-sm">
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[6px] bg-[#f4eadf] text-[#bd6f3c]">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#171713] font-serif">{item.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-[#70695f]">{item.text}</p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] py-14 sm:py-20">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="lg:col-span-4">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Implementación</span>
                        <h2 className="mt-4 text-3xl font-bold leading-tight text-[#171713] font-serif">
                            Primer approach, sin cerrar todavía el costeo.
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-[#70695f]">
                            La página presenta el servicio como oferta estratégica en desarrollo, evitando prometer paquetes rígidos antes de validar alcance, tiempos y costos.
                        </p>
                    </div>
                    <div className="lg:col-span-8">
                        <div className="grid gap-3 sm:grid-cols-2">
                            {method.map((step, idx) => (
                                <div key={step} className="rounded-[8px] border border-[#eee8dc] bg-[#fffdf8] p-5">
                                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#bd6f3c]">0{idx + 1}</span>
                                    <p className="mt-3 text-base font-semibold leading-7 text-[#3f423a]">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#f8f5ee] py-14 sm:py-20">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="lg:col-span-5">
                        <div className="rounded-[10px] border border-[#ead8c7] bg-[#fffdf8] p-7 shadow-sm">
                            <ShieldCheck className="h-9 w-9 text-[#bd6f3c]" />
                            <h2 className="mt-5 text-3xl font-bold leading-tight text-[#171713] font-serif">
                                Equipo base interdisciplinario.
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-[#70695f]">
                                El producto se sostiene en una combinación de capacidades clínicas, sociales, educativas, normativas y tecnológicas. Esa mezcla es la diferencia frente a una asesoría aislada.
                            </p>
                        </div>
                    </div>
                    <div className="lg:col-span-7">
                        <div className="grid gap-3">
                            {roles.map((role) => (
                                <div key={role} className="flex items-center gap-3 rounded-[6px] border border-[#eee8dc] bg-[#fffdf8] px-4 py-4">
                                    <Check className="h-4 w-4 shrink-0 text-[#bd6f3c]" />
                                    <span className="text-sm font-semibold text-[#3f423a]">{role}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-[8px] border border-[#eee8dc] bg-[#fffdf8] p-5">
                                <ClipboardCheck className="h-6 w-6 text-[#bd6f3c]" />
                                <h3 className="mt-3 text-lg font-bold text-[#171713] font-serif">Protocolos vivos</h3>
                                <p className="mt-2 text-sm leading-7 text-[#70695f]">Documentos, rutas y decisiones conectadas con la práctica diaria del colegio.</p>
                            </div>
                            <div className="rounded-[8px] border border-[#eee8dc] bg-[#fffdf8] p-5">
                                <Network className="h-6 w-6 text-[#bd6f3c]" />
                                <h3 className="mt-3 text-lg font-bold text-[#171713] font-serif">Gestión trazable</h3>
                                <p className="mt-2 text-sm leading-7 text-[#70695f]">Seguimiento, evidencia y aprendizaje institucional para sostener el bienestar escolar.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
