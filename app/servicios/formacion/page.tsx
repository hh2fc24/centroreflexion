import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { EngagementList, PersonInCharge, SectionHead, ServiceHero } from "../_components/Blocks";
import { FORMACION_PROGRAMA, FORMACION_SEMINARIO, VALUE_NOTE } from "../_components/engagements";
import { JUAN_CARLOS } from "../_components/people";
import { Reveal } from "../_components/Reveal";
import { btnPrimary, container, labelMuted, textLink } from "../_components/ui";

export const metadata: Metadata = pageMetadata({
    title: "Formación y Capacitación | Intervención en Crisis y Equipos",
    description:
        "Capacitación en intervención de crisis, salud mental, inclusión y trabajo con comunidad. Aprendizaje situado, supervisión reflexiva y aplicación práctica para equipos e instituciones.",
    path: "/servicios/formacion",
    ogTitle: "Formación CRC para equipos e instituciones",
    ogDescription: "Programas de capacitación con fundamento técnico y transferencia a casos y protocolos reales.",
});

type Activity = { name: string; detail: string; price: string };

const juanTraining: Activity[] = [
    { name: "Capacitación en intervención de crisis", detail: "Modalidad presencial u online. Programas de 4 a 8 horas.", price: "Desde 5 UF" },
    { name: "Supervisión clínica de casos", detail: "Para equipos de protección infantil, infancia, familia y programas sociales.", price: "2.5 UF / sesión" },
    { name: "Formación en gestión de programas sociales", detail: "Diseño, implementación, evaluación y criterios de mejora.", price: "Desde 8 UF" },
    { name: "Taller de evaluación pericial", detail: "Competencias parentales, riesgo psicosocial y lectura de antecedentes.", price: "Desde 6 UF" },
    { name: "Asesoría estratégica institucional", detail: "Diseño de modelos de intervención y criterios de decisión.", price: "A cotizar" },
];

const rocioTraining: Activity[] = [
    { name: "Charlas en salud mental y género", detail: "Instancias presenciales u online de 60 a 90 minutos.", price: "Consultar" },
    { name: "Formación de equipos en VIF", detail: "Actualización conceptual, abordaje situado y criterios de cuidado.", price: "Consultar" },
    { name: "Asesorías PIE", detail: "Supervisión reflexiva para Programas de Integración Escolar.", price: "Plan" },
    { name: "Taller de terapia ocupacional comunitaria", detail: "Enfoque de derechos humanos, participación y territorio.", price: "Consultar" },
    { name: "Acompañamiento en terreno", detail: "Capacitación para equipos de salud mental comunitaria.", price: "Consultar" },
];

const principles = [
    { title: "Contenido con fundamento", text: "Marco conceptual, casos, discusión técnica y herramientas aplicables al trabajo cotidiano." },
    { title: "Diseño para equipos", text: "Ajustamos duración, modalidad y profundidad según el contexto institucional." },
    { title: "Aplicación práctica", text: "No solo exposición: buscamos transferencia a casos, protocolos y decisiones reales." },
];

const advisory = [
    "Supervisión de casos en salud mental",
    "Orientación en evaluación e intervención",
    "Supervisión individual o grupal",
    "Apoyo en planificación e intervenciones",
    "Charlas clínicas y espacios de reflexión sobre buenas prácticas",
    "Trabajo interdisciplinario con equipos de salud y educación",
];

function ActivityTable({ who, title, items }: { who: string; title: string; items: Activity[] }) {
    return (
        <Reveal>
            <p className="text-[0.8125rem] font-semibold text-[#9f5528]">{who}</p>
            <h3 className="crc-serif mt-1 text-[1.35rem] font-medium leading-[1.25] text-[#171713]">{title}</h3>
            <ul className="mt-5 border-t border-[#d8cfc0]">
                {items.map((item) => (
                    <li key={item.name} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-[#d8cfc0] py-4">
                        <span>
                            <span className="block text-[1rem] font-semibold leading-[1.4] text-[#171713]">{item.name}</span>
                            <span className="mt-1 block text-[0.9375rem] leading-[1.6] text-[#55574f]">{item.detail}</span>
                        </span>
                        <span className="whitespace-nowrap text-right text-[0.9375rem] font-semibold tabular-nums text-[#9f5528]">{item.price}</span>
                    </li>
                ))}
            </ul>
        </Reveal>
    );
}

export default function FormacionPage() {
    return (
        <main className="bg-[#fffdf8] text-[#171713]">
            <ServiceHero
                area="Formación"
                title="Formación aplicada, supervisión y asesoría para equipos"
                intro={
                    <p>
                        Capacitaciones, jornadas clínicas, supervisión de casos y actualización técnica para profesionales,
                        instituciones, comunidades educativas y equipos de intervención.
                    </p>
                }
                actions={
                    <>
                        <Link href="/instituciones?servicio=formacion#agenda" className={btnPrimary}>
                            Agenda 20 minutos con Hugo
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <a href="#compromisos" className={textLink}>
                            Ver los compromisos
                        </a>
                    </>
                }
                facts={[
                    { term: "Para quién", detail: "Programas de protección, colegios, fundaciones y equipos de salud o intervención social." },
                    { term: "Compromisos", detail: "Programa de formación para equipos · Seminario en formato cerrado" },
                    { term: "Modalidad", detail: "Presencial · Online" },
                    { term: "A cargo", detail: JUAN_CARLOS.name },
                    { term: "Valor", detail: VALUE_NOTE },
                ]}
            />

            {/* Principios */}
            <section aria-labelledby="principios-title" className="bg-[#fffdf8]">
                <div className={`${container} py-16 sm:py-24`}>
                    <Reveal>
                        <SectionHead eyebrow="Cómo formamos" title="Aprendizaje situado, supervisión reflexiva y trabajo con comunidad." id="principios-title" />
                    </Reveal>
                    <ol className="mt-12 grid border-t border-[#d8cfc0] md:grid-cols-3">
                        {principles.map((item, index) => (
                            <li key={item.title} className="border-b border-[#d8cfc0] py-8 md:border-b-0 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0">
                                <Reveal delay={index * 0.06}>
                                    <p className="text-[0.8125rem] font-semibold tabular-nums text-[#9f5528]">{String(index + 1).padStart(2, "0")}</p>
                                    <h3 className="crc-serif mt-2 text-[1.35rem] font-medium leading-[1.2] text-[#171713]">{item.title}</h3>
                                    <p className="mt-3 text-[1rem] leading-[1.7] text-[#55574f]">{item.text}</p>
                                </Reveal>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <EngagementList
                engagements={[FORMACION_PROGRAMA, FORMACION_SEMINARIO]}
                className="border-t border-[#d8cfc0] bg-[#f8f5ee]"
                title="Dos compromisos para equipos que trabajan con infancia"
                intro={
                    <p>
                        El programa se arma con los temas del catálogo según lo que necesite el equipo. El seminario en formato cerrado es
                        el mismo seminario abierto de Juan Carlos Rauld, dictado solo para una institución.{" "}
                        <Link href="/seminarios/desproteccion-infancia" className="font-semibold text-[#9f5528] underline decoration-[#d8cfc0] underline-offset-4 hover:text-[#171713]">
                            Ver el programa del seminario
                        </Link>
                        .
                    </p>
                }
            />

            {/* Catálogo */}
            <section aria-labelledby="catalogo-title" className="border-t border-[#d8cfc0] bg-[#fffdf8]">
                <div className={`${container} py-16 sm:py-24`}>
                    <Reveal>
                        <SectionHead eyebrow="Catálogo" title="Temas y valores de referencia por actividad" id="catalogo-title">
                            <p>
                                Actividades sueltas que también se pueden contratar por separado. Los valores son de referencia para una
                                actividad; un programa completo se cotiza según su alcance.
                            </p>
                        </SectionHead>
                    </Reveal>
                    <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
                        <ActivityTable who="Juan Carlos Rauld" title="Crisis, infancia, evaluación y programas sociales" items={juanTraining} />
                        <ActivityTable who="Rocío Solar" title="Salud mental, género, VIF, PIE y terapia ocupacional comunitaria" items={rocioTraining} />
                    </div>
                </div>
            </section>

            {/* Supervisión y asesorías */}
            <section aria-labelledby="supervision-title" className="border-t border-[#d8cfc0] bg-[#f8f5ee]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16`}>
                    <Reveal>
                        <SectionHead eyebrow="Supervisión y asesorías" title="Para colegas y equipos que necesitan pensar sus casos." id="supervision-title">
                            <p>
                                Reflexión técnica, bienestar profesional, cuidado de la práctica y revisión de casos. La supervisión de casos
                                complejos en salud mental la dirige Rocío Solar.
                            </p>
                        </SectionHead>
                        <Link href="/servicios/clinica#supervision" className={`${textLink} mt-6`}>
                            Ver supervisión clínica de casos complejos
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </Reveal>
                    <Reveal>
                        <p className={labelMuted}>Qué se puede trabajar</p>
                        <ul className="mt-3 grid border-t border-[#d8cfc0] sm:grid-cols-2 sm:gap-x-8">
                            {advisory.map((item) => (
                                <li key={item} className="border-b border-[#d8cfc0] py-4 text-[1rem] leading-[1.55] text-[#171713]">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            <PersonInCharge
                person={JUAN_CARLOS}
                className="bg-[#fffdf8]"
                cta={{ href: "/instituciones?servicio=formacion#agenda", label: "Coordinar una formación" }}
                secondary={
                    <Link href="/seminarios/desproteccion-infancia" className={textLink}>
                        Ver el seminario abierto
                    </Link>
                }
            >
                <p>
                    Juan Carlos dirige el CRC y el área de formación. Es trabajador social, magíster en Pensamiento Contemporáneo (UDP) y
                    doctorando en Trabajo Social en la Universitat Rovira i Virgili. Su trabajo cruza programas de infancia, salud mental,
                    protección de derechos y análisis institucional.
                </p>
                <p>
                    Dicta él mismo los programas y el seminario Desprotección de la infancia, basado en su libro con Editorial Hammurabi.
                    La coordinación de fechas, alcance y convenio la lleva Hugo Felipe Hormazábal.
                </p>
            </PersonInCharge>
        </main>
    );
}
