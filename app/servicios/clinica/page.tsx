import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { EditorialImage, EditorialVideo, EngagementList, PersonInCharge, SectionHead, ServiceHero } from "../_components/Blocks";
import { SUPERVISION_CLINICA } from "../_components/engagements";
import { JUAN_CARLOS } from "../_components/people";
import { Reveal } from "../_components/Reveal";
import { btnPrimary, container, labelMuted, textLink } from "../_components/ui";

export const metadata: Metadata = pageMetadata({
    title: "Atención Clínica | Salud Mental, Infancia y Familia",
    description:
        "Evaluación, intervención y acompañamiento en salud mental, infancia y familia. Atención presencial, online y domiciliaria con informes técnicos y periciales.",
    path: "/servicios/clinica",
    ogTitle: "Atención clínica CRC: salud mental, infancia y familia",
    ogDescription: "Apoyo profesional para ordenar lo que está pasando y definir un proceso de cuidado en salud mental, infancia y familia.",
});

const juanServices = [
    { name: "Evaluación de competencias parentales", detail: "Análisis psicosocial, contexto familiar, factores protectores y riesgo.", price: "Desde 3 UF" },
    { name: "Consultoría psicosocial clínica", detail: "Orientación técnica para casos complejos de infancia, familia y protección.", price: "2.5 UF / sesión" },
    { name: "Evaluación de riesgo psicosocial", detail: "Lectura situada de vulneración, exposición, redes y trayectorias institucionales.", price: "A cotizar" },
    { name: "Informes sociales periciales", detail: "Documentos técnicos para contextos judiciales, institucionales o familiares.", price: "Desde 4 UF" },
    { name: "Visitas domiciliarias", detail: "Observación de entorno, rutinas, vínculos y condiciones materiales de cuidado.", price: "Desde 3 UF" },
];

const conditions = [
    "TEA, TDAH, discapacidad intelectual, aprendizaje y coordinación",
    "Depresión, distimia, bipolaridad y alteraciones del ánimo",
    "Ansiedad generalizada, pánico, fobias, ansiedad social y TOC",
    "Primer episodio psicótico, esquizofrenia y cuadros relacionados",
    "Dificultades de autonomía, habilidades sociales y participación",
];

const addictionAreas = [
    "Alcohol y sustancias",
    "Pantallas y tecnología",
    "Juego patológico",
    "Compras compulsivas",
    "Co-dependencia",
    "Tabaquismo",
];

const modalities = [
    { title: "Informes socioocupacionales", text: "Documentos técnicos con respaldo clínico, social y ocupacional para contextos educativos, judiciales, laborales o institucionales." },
    { title: "Análisis del entorno", text: "Visitas, observación y lectura de condiciones reales de vida, autonomía, redes y desempeño cotidiano." },
    { title: "Modalidad flexible", text: "Atención presencial, online, domiciliaria o en terreno, según pertinencia clínica y contexto." },
];

export default function ClinicaPage() {
    return (
        <main className="bg-[#fffdf8] text-[#171713]">
            <ServiceHero
                area="Atención clínica"
                title="Evaluación, intervención y acompañamiento clínico"
                intro={
                    <p>
                        Reunimos trabajo social clínico, terapia ocupacional, salud mental, infancia, familia y análisis del entorno para
                        orientar decisiones con criterio técnico y calidez.
                    </p>
                }
                actions={
                    <>
                        <Link href="/contacto?servicio=clinica" className={btnPrimary}>
                            Solicitar orientación clínica
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <a href="#supervision" className={textLink}>
                            Supervisión para equipos
                        </a>
                    </>
                }
                facts={[
                    { term: "Para quién", detail: "Personas y familias que necesitan un proceso clínico o un documento con validez técnica." },
                    { term: "Modalidad", detail: "Presencial · Online · Domiciliaria" },
                    { term: "Dirección", detail: `${JUAN_CARLOS.name}, ${JUAN_CARLOS.role}` },
                    { term: "Para equipos", detail: "Supervisión clínica de casos complejos" },
                ]}
                media={
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-6">
                        <EditorialVideo src="/22.mp4" autoPlay aspect="aspect-[16/9] lg:aspect-auto lg:h-[360px]" />
                        <EditorialVideo src="/44.mp4" autoPlay aspect="lg:h-[360px]" className="hidden lg:block" />
                    </div>
                }
            />

            {/* Evaluación psicosocial */}
            <section aria-labelledby="evaluacion-title" className="bg-[#fffdf8]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16`}>
                    <Reveal>
                        <SectionHead eyebrow="Juan Carlos Rauld · Trabajo social clínico" title="Evaluación psicosocial" id="evaluacion-title">
                            <p>
                                Servicios especializados en infancia, trauma psicosocial, familia, protección de derechos y casos que
                                requieren respaldo documental.
                            </p>
                        </SectionHead>
                    </Reveal>
                    <Reveal>
                        <ul className="border-t border-[#d8cfc0]">
                            {juanServices.map((item) => (
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
                </div>
            </section>

            {/* Informes socioocupacionales */}
            <section aria-labelledby="informes-title" className="border-t border-[#d8cfc0] bg-[#f8f5ee]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16`}>
                    <Reveal>
                        <EditorialImage
                            src="/images/informes_socioocupacionales.png"
                            alt="Informes socioocupacionales"
                            sizes="(min-width: 1024px) 560px, 100vw"
                            aspect="aspect-[4/3]"
                        />
                        <p className="mt-3 text-[0.875rem] leading-[1.6] text-[#6f675d]">
                            Contextos educativos, judiciales, laborales e institucionales · Presencial y online
                        </p>
                    </Reveal>
                    <Reveal>
                        <SectionHead eyebrow="Servicio destacado" title="El documento que cambia el rumbo." id="informes-title">
                            <p>
                                Elaboramos documentos con respaldo clínico, social y ocupacional para contextos educativos, judiciales,
                                laborales e institucionales.
                            </p>
                        </SectionHead>
                        <p className={`${labelMuted} mt-8`}>Para quién</p>
                        <ul className="mt-2 grid border-t border-[#d8cfc0] sm:grid-cols-2 sm:gap-x-8">
                            {["Niños y adolescentes", "Personas adultas", "Familias y cuidadores", "Organizaciones"].map((item) => (
                                <li key={item} className="border-b border-[#d8cfc0] py-3 text-[1rem] text-[#171713]">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            {/* Condiciones */}
            <section aria-labelledby="condiciones-title" className="border-t border-[#d8cfc0] bg-[#f8f5ee]">
                <div className={`${container} py-16 sm:py-24`}>
                    <Reveal>
                        <SectionHead eyebrow="Alcance clínico" title="Condiciones que abordamos" id="condiciones-title">
                            <p>
                                Si todavía no sabes si lo que ocurre en tu familia amerita consultar,{" "}
                                <Link href="/servicios/acompanamiento-familiar" className="font-semibold text-[#9f5528] underline decoration-[#d8cfc0] underline-offset-4 hover:text-[#171713]">
                                    parte por acompañamiento familiar
                                </Link>
                                : ahí se ordena la necesidad antes de definir un proceso clínico.
                            </p>
                        </SectionHead>
                    </Reveal>
                    <Reveal className="mt-10">
                        <ul className="grid border-t border-[#d8cfc0] md:grid-cols-2 md:gap-x-10">
                            {conditions.map((item) => (
                                <li key={item} className="border-b border-[#d8cfc0] py-4 text-[1rem] leading-[1.55] text-[#171713]">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            {/* Adicciones */}
            <section aria-labelledby="adicciones-title" className="bg-[#15120e] text-[#fbf7ee]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16`}>
                    <Reveal>
                        <SectionHead eyebrow="Psicología clínica y adicciones" title="Recuperar control, sin juicio y con método." id="adicciones-title" dark>
                            <p>
                                Abordaje de consumo problemático, adicciones conductuales y comorbilidades asociadas desde una intervención
                                compasiva, sostenida y libre de estigma.
                            </p>
                        </SectionHead>
                    </Reveal>
                    <Reveal>
                        <ul className="grid border-t border-white/15 sm:grid-cols-2 sm:gap-x-8">
                            {addictionAreas.map((area) => (
                                <li key={area} className="border-b border-white/15 py-4 text-[1rem] text-[#fbf7ee]">
                                    {area}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            {/* Modalidades */}
            <section aria-label="Modalidades de trabajo" className="bg-[#fffdf8]">
                <div className={`${container} py-16 sm:py-20`}>
                    <ol className="grid border-y border-[#d8cfc0] md:grid-cols-3">
                        {modalities.map((item, index) => (
                            <li key={item.title} className="border-b border-[#d8cfc0] py-8 last:border-b-0 md:border-b-0 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0">
                                <Reveal delay={index * 0.06}>
                                    <h3 className="crc-serif text-[1.35rem] font-medium leading-[1.2] text-[#171713]">{item.title}</h3>
                                    <p className="mt-3 text-[1rem] leading-[1.7] text-[#55574f]">{item.text}</p>
                                </Reveal>
                            </li>
                        ))}
                    </ol>
                    <Reveal className="mt-10">
                        <Link href="/contacto?servicio=clinica" className={btnPrimary}>
                            Solicitar orientación clínica
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </Reveal>
                </div>
            </section>

            <EngagementList
                id="supervision"
                engagements={[SUPERVISION_CLINICA]}
                className="border-t border-[#d8cfc0] bg-[#f8f5ee]"
                eyebrow="Para equipos e instituciones"
                title="Supervisión clínica de casos complejos"
                intro={
                    <p>
                        Para equipos que sostienen casos de salud mental infanto-juvenil que superan la respuesta habitual. Se coordina
                        con el equipo del CRC, que prepara la propuesta y el convenio con la institución.
                    </p>
                }
            />

            <PersonInCharge
                person={JUAN_CARLOS}
                className="bg-[#fffdf8]"
                cta={{ href: "/contacto?servicio=clinica", label: "Solicitar orientación clínica" }}
                secondary={
                    <Link href="/instituciones?servicio=supervision-clinica#agenda" className={textLink}>
                        Supervisión para un equipo
                    </Link>
                }
            >
                <p>
                    Juan Carlos dirige el CRC y posee doble especialización en salud mental infantil y en filosofía práctica de la niñez.
                    Cuenta con más de 15 años de trayectoria en intervención clínica especializada, evaluación pericial y supervisión de
                    casos complejos en protección infantil y salud mental.
                </p>
                <p>
                    Trabaja junto al equipo clínico interdisciplinario del CRC en procesos de evaluación, psicoterapia, acompañamiento
                    familiar y supervisión de equipos institucionales.
                </p>
            </PersonInCharge>
        </main>
    );
}
