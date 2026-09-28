import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { EngagementList, PersonInCharge, SectionHead, ServiceHero } from "../_components/Blocks";
import { CONSULTORIA_MODELO, VALUE_NOTE } from "../_components/engagements";
import { HUGO } from "../_components/people";
import { Reveal } from "../_components/Reveal";
import { btnPrimary, btnSecondaryOnDark, container, textLink } from "../_components/ui";

export const metadata: Metadata = pageMetadata({
    title: "Consultoría Institucional | Modelos de Intervención y Gestión",
    description:
        "Diagnóstico y mejora de modelos de intervención, programas sociales y procesos institucionales. Trabajo social, salud mental, derecho, sociología y transformación digital.",
    path: "/servicios/consultoria",
    ogTitle: "Consultoría institucional CRC",
    ogDescription: "Criterios, procesos y herramientas para organizaciones, fundaciones y equipos directivos.",
});

const layers = [
    {
        title: "Consultoría estratégica",
        text: "Asesoría organizacional centrada en salud mental infantil, infancia, programas sociales y modelos de intervención basados en evidencia.",
    },
    {
        title: "Salud mental e inclusión educativa",
        text: "Estrategias situadas que articulan salud mental, inclusión, trabajo territorial y bienestar para comunidades educativas.",
    },
    {
        title: "Capa tecnológica",
        text: "Diseño de flujos, CRM, reportería, automatización, inteligencia aplicada y trazabilidad operativa junto a Altius Ignite.",
    },
];

const outcomes = [
    { title: "Criterio técnico", text: "Lectura rigurosa de riesgos, brechas, gobernanza y oportunidades de mejora." },
    { title: "Trazabilidad", text: "Indicadores, evidencias y reportería para sostener decisiones institucionales." },
    { title: "Implementación", text: "Procesos, herramientas y acompañamiento para que el diseño llegue a la práctica." },
];

const disciplines = [
    { title: "Trabajo social y salud mental", tags: ["Evaluación pericial", "Programas sociales", "Infancia y familia"] },
    { title: "Terapia ocupacional", tags: ["Inclusión", "Salud mental", "Derechos humanos"] },
    { title: "Derecho y ciencias jurídicas", tags: ["Familia", "Protección", "Normativa"] },
    { title: "Sociología y ciencias sociales", tags: ["Diagnóstico", "Investigación", "Territorio"] },
    { title: "Gestión, BI y transformación digital", tags: ["CRM", "Experiencia de usuario", "Automatización"] },
    { title: "Política pública e institucional", tags: ["Gobernanza", "Evaluación", "Mejora continua"] },
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
            <ServiceHero
                area="Consultoría"
                title="Ciencias sociales, gestión y tecnología para programas que trabajan con problemas complejos"
                intro={
                    <p>
                        Diseñamos, ordenamos e implementamos modelos de intervención, procesos, protocolos y herramientas. La consultoría
                        no queda en un informe: baja a rutas, roles, indicadores y registros que la institución pueda sostener.
                    </p>
                }
                actions={
                    <>
                        <Link href="/instituciones?servicio=consultoria#agenda" className={btnPrimary}>
                            Agenda 20 minutos con Hugo
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <a href="#compromisos" className={textLink}>
                            Ver el compromiso
                        </a>
                    </>
                }
                facts={[
                    { term: "Para quién", detail: "Programas sociales, fundaciones, municipios y equipos directivos." },
                    { term: "Compromiso", detail: "Evaluación y rediseño de modelo de intervención" },
                    { term: "Modalidad", detail: "Presencial · Online" },
                    { term: "A cargo", detail: HUGO.name },
                    { term: "Valor", detail: VALUE_NOTE },
                ]}
            />

            {/* Tres capas */}
            <section aria-labelledby="capas-title" className="bg-[#fffdf8]">
                <div className={`${container} py-16 sm:py-24`}>
                    <Reveal>
                        <SectionHead eyebrow="Tres capas de trabajo" title="No solo asesoramos: diseñamos estructura para operar." id="capas-title" />
                    </Reveal>
                    <ol className="mt-12 grid border-t border-[#d8cfc0] md:grid-cols-3">
                        {layers.map((layer, index) => (
                            <li key={layer.title} className="border-b border-[#d8cfc0] py-8 md:border-b-0 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0">
                                <Reveal delay={index * 0.06}>
                                    <p className="text-[0.8125rem] font-semibold tabular-nums text-[#9f5528]">{String(index + 1).padStart(2, "0")}</p>
                                    <h3 className="crc-serif mt-2 text-[1.35rem] font-medium leading-[1.2] text-[#171713]">{layer.title}</h3>
                                    <p className="mt-3 text-[1rem] leading-[1.7] text-[#55574f]">{layer.text}</p>
                                </Reveal>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Arquitectura estratégica: composición tipográfica */}
            <section aria-labelledby="arquitectura-title" className="border-t border-[#d8cfc0] bg-[#f8f5ee]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16`}>
                    <Reveal>
                        <SectionHead eyebrow="Arquitectura estratégica" title="Convertimos problemas difusos en sistemas de trabajo." id="arquitectura-title">
                            <p>
                                Rutas, roles, indicadores, gobernanza y herramientas para que la institución pueda sostener el cambio cuando
                                el CRC ya no está en la sala.
                            </p>
                        </SectionHead>
                    </Reveal>
                    <Reveal className="rounded-[6px] bg-[#15120e] p-6 text-[#fbf7ee] sm:p-10">
                        <p className="text-[0.8125rem] font-semibold text-[#e4935d]">Lo que queda instalado</p>
                        <dl className="mt-4">
                            {outcomes.map((item) => (
                                <div key={item.title} className="grid gap-1 border-t border-white/15 py-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                                    <dt className="crc-serif text-[1.25rem] font-medium leading-[1.25]">{item.title}</dt>
                                    <dd className="text-[0.9375rem] leading-[1.65] text-[#ede7dc]/80">{item.text}</dd>
                                </div>
                            ))}
                        </dl>
                    </Reveal>
                </div>
            </section>

            {/* Disciplinas */}
            <section aria-labelledby="disciplinas-title" className="border-t border-[#d8cfc0] bg-[#fffdf8]">
                <div className={`${container} py-16 sm:py-24`}>
                    <Reveal>
                        <SectionHead eyebrow="Equipo multidisciplinario" title="Problemas que no caben en una sola disciplina." id="disciplinas-title">
                            <p>
                                Articulamos clínica, ciencias sociales, salud mental, gestión, tecnología y cumplimiento normativo para que
                                cada intervención tenga profundidad técnica y una operación clara.
                            </p>
                        </SectionHead>
                    </Reveal>
                    <Reveal className="mt-12">
                        <ul className="grid border-t border-[#d8cfc0] sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
                            {disciplines.map((item) => (
                                <li key={item.title} className="border-b border-[#d8cfc0] py-5">
                                    <p className="crc-serif text-[1.2rem] font-medium leading-[1.25] text-[#171713]">{item.title}</p>
                                    <p className="mt-1.5 text-[0.9375rem] text-[#6f675d]">{item.tags.join(" · ")}</p>
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            <EngagementList
                engagements={[CONSULTORIA_MODELO]}
                className="border-t border-[#d8cfc0] bg-[#f8f5ee]"
                eyebrow="Compromiso"
                title="Un compromiso con principio, fin y entregable"
                intro={
                    <p>
                        Parte con un diagnóstico del modelo vigente y termina con un modelo rediseñado que el equipo ya está usando. Se
                        puede detener después del diagnóstico si la institución prefiere implementar por su cuenta.
                    </p>
                }
            />

            {/* Altius Ignite */}
            <section aria-labelledby="altius-title" className="bg-[#15120e] text-[#fbf7ee]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16`}>
                    <Reveal>
                        <div className="relative h-12 w-36">
                            <Image src="/altius-logo.png" alt="Altius Ignite" fill sizes="144px" className="object-contain object-left" />
                        </div>
                        <SectionHead eyebrow="Alianza tecnológica" title="Metodologías sociales con soporte tecnológico." id="altius-title" dark className="mt-8">
                            <p>
                                La alianza con Altius Ignite permite convertir modelos, diagnósticos y programas en flujos que se pueden operar,
                                medir y escalar.
                            </p>
                        </SectionHead>
                        <a href="https://www.altiusignite.com" target="_blank" rel="noopener noreferrer" className={`${btnSecondaryOnDark} mt-8`}>
                            Conocer Altius Ignite
                            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                    </Reveal>
                    <Reveal>
                        <p className="text-[0.8125rem] font-semibold text-[#ede7dc]/60">Qué aporta a un programa</p>
                        <ul className="mt-3 border-t border-white/15">
                            {altius.map((item) => (
                                <li key={item} className="border-b border-white/15 py-4 text-[1rem] leading-[1.6] text-[#fbf7ee]">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            <PersonInCharge
                person={HUGO}
                cta={{ href: "/instituciones?servicio=consultoria#agenda", label: "Agenda 20 minutos con Hugo" }}
            >
                <p>
                    Hugo dirige el área comercial y de desarrollo institucional del CRC: es con quien conversan programas, fundaciones y
                    municipios. Arma el diagnóstico, la propuesta y el convenio, y se asegura de que lo acordado se implemente y se mida.
                </p>
                <p>
                    Ha implementado y escalado operaciones en Chile, Colombia, Argentina, Perú y Bolivia, con equipos de hasta 700
                    personas, procesos de mejora continua, CRM y reportería ejecutiva.
                </p>
            </PersonInCharge>
        </main>
    );
}
