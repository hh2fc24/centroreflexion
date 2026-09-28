import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { EditorialImage, EngagementList, PersonInCharge, SectionHead, ServiceHero } from "../_components/Blocks";
import { BIENESTAR_CONVIVENCIA, VALUE_NOTE } from "../_components/engagements";
import { HUGO, ROCIO } from "../_components/people";
import { Reveal } from "../_components/Reveal";
import { btnPrimary, container, labelMuted, textLink } from "../_components/ui";

export const metadata: Metadata = pageMetadata({
    title: "Bienestar Escolar | Convivencia, Protección y Cumplimiento Ley 21.809",
    description:
        "Asesoría en convivencia escolar, protección institucional y cumplimiento de la Ley 21.809 de Convivencia, Buen Trato y Bienestar. Protocolos frente a acoso y maltrato escolar.",
    path: "/servicios/bienestar-escolar",
    ogTitle: "Bienestar escolar CRC: convivencia y protección institucional",
    ogDescription: "Apoyo técnico para colegios frente a la nueva Ley de Convivencia Escolar: protocolos, planes de convivencia y prevención de bullying.",
});

const system = [
    { title: "Bienestar", text: "Prevención socioemocional, trabajo con familias y lectura temprana de señales." },
    { title: "Convivencia", text: "Clima escolar, mediación, conflictos, seguimiento y coordinación interna." },
    { title: "Protección", text: "Salud mental, riesgo suicida, derivación y contención inicial responsable." },
    { title: "Cumplimiento", text: "Protocolos aplicables, registros, responsables y preparación frente a fiscalización." },
];

const method = [
    { title: "Diagnóstico institucional", text: "Levantamos brechas, capacidades internas, exposición normativa y casos sensibles." },
    { title: "Diseño de criterios y rutas", text: "Definimos roles, rutas de actuación, criterios de escalamiento y registro." },
    { title: "Entrenamiento del equipo", text: "Entrenamos al equipo para reconocer señales, coordinar decisiones y actuar bajo presión." },
    { title: "Seguimiento con evidencia", text: "Medimos, revisamos casos y dejamos aprendizaje institucional acumulado." },
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

const outcomes = [
    "Criterios comunes para detectar y priorizar.",
    "Rutas entendibles para equipos directivos, convivencia y apoyo.",
    "Registro de decisiones, responsables y seguimiento.",
    "Un colegio enfocado en educar, con soporte experto para lo complejo.",
];

export default function BienestarEscolarPage() {
    return (
        <main className="bg-[#fffdf8] text-[#171713]">
            <ServiceHero
                area="Bienestar escolar"
                title="Gestión experta para colegios que no pueden improvisar frente a una crisis"
                intro={
                    <p>
                        Acompañamiento interdisciplinario para ordenar convivencia, salud mental, protección y cumplimiento, dejando
                        capacidades instaladas en el establecimiento.
                    </p>
                }
                actions={
                    <>
                        <Link href="/instituciones?servicio=bienestar-escolar#agenda" className={btnPrimary}>
                            Agenda 20 minutos con Hugo
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <a href="#sistema" className={textLink}>
                            Ver el sistema de trabajo
                        </a>
                    </>
                }
                facts={[
                    { term: "Para quién", detail: "Colegios y comunidades educativas que necesitan ordenar su gestión preventiva." },
                    { term: "Compromiso", detail: "Bienestar y convivencia escolar" },
                    { term: "Marco", detail: "Ley 21.809 de Convivencia, Buen Trato y Bienestar" },
                    { term: "A cargo", detail: `${HUGO.name}, con la dirección clínica de ${ROCIO.name}` },
                    { term: "Valor", detail: VALUE_NOTE },
                ]}
                media={
                    <EditorialImage
                        src="/images/bienestar-escolar/hero-proteccion-institucional.png"
                        alt="Equipo directivo de un colegio revisando rutas de protección institucional"
                        sizes="(min-width: 1200px) 1136px, 100vw"
                        aspect="aspect-[16/10] sm:aspect-[21/9]"
                        priority
                    />
                }
            />

            {/* Contexto */}
            <section aria-labelledby="contexto-title" className="bg-[#fffdf8]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16`}>
                    <Reveal>
                        <SectionHead
                            eyebrow="Contexto del desafío"
                            title="La gestión escolar quedó en el cruce de salud mental, convivencia, familias y cumplimiento."
                            id="contexto-title"
                        >
                            <p>
                                Los colegios enfrentan casos sensibles con equipos exigidos, marcos normativos en movimiento y comunidades
                                que demandan respuestas rápidas. El CRC convierte esa presión en un sistema de actuación: lectura del riesgo,
                                coordinación de roles, criterios compartidos y evidencia para sostener decisiones.
                            </p>
                        </SectionHead>
                    </Reveal>
                    <Reveal className="self-end border-l-2 border-[#bd6f3c] pl-6">
                        <p className={labelMuted}>Idea central</p>
                        <p className="crc-serif mt-3 text-[1.5rem] font-medium leading-[1.3] text-[#171713]">
                            El estándar ya no es tener protocolos: es demostrar que la institución supo actuar.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* Sistema */}
            <section id="sistema" aria-labelledby="sistema-title" className="scroll-mt-24 border-t border-[#d8cfc0] bg-[#f8f5ee]">
                <div className={`${container} py-16 sm:py-24`}>
                    <Reveal>
                        <SectionHead eyebrow="Sistema de trabajo" title="No son módulos sueltos. Es una misma gobernanza para responder mejor." id="sistema-title" />
                    </Reveal>
                    <ol className="mt-12 grid border-y border-[#d8cfc0] sm:grid-cols-2 lg:grid-cols-4">
                        {system.map((item, index) => (
                            <li key={item.title} className="border-b border-[#d8cfc0] py-8 last:border-b-0 sm:pr-6 lg:border-b-0 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0">
                                <Reveal delay={index * 0.05}>
                                    <p className="text-[0.8125rem] font-semibold tabular-nums text-[#9f5528]">{String(index + 1).padStart(2, "0")}</p>
                                    <h3 className="crc-serif mt-2 text-[1.35rem] font-medium leading-[1.2] text-[#171713]">{item.title}</h3>
                                    <p className="mt-3 text-[1rem] leading-[1.7] text-[#55574f]">{item.text}</p>
                                </Reveal>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Preguntas críticas */}
            <section aria-labelledby="preguntas-title" className="bg-[#15120e] text-[#fbf7ee]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16`}>
                    <Reveal>
                        <SectionHead
                            eyebrow="Preguntas críticas"
                            title="El servicio empieza donde la respuesta habitual se vuelve insuficiente."
                            id="preguntas-title"
                            dark
                        />
                    </Reveal>
                    <Reveal>
                        <ul className="border-t border-white/15">
                            {questions.map((question) => (
                                <li key={question} className="crc-serif border-b border-white/15 py-5 text-[1.25rem] leading-[1.35] text-[#fbf7ee]">
                                    {question}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            {/* Enfoque */}
            <section aria-labelledby="enfoque-title" className="bg-[#fffdf8]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16`}>
                    <Reveal>
                        <SectionHead eyebrow="Enfoque de intervención" title="Del diagnóstico al aprendizaje institucional." id="enfoque-title" />
                        <EditorialImage
                            src="/images/bienestar-escolar/metodo-trazabilidad.png"
                            alt="Registro y trazabilidad de decisiones en la gestión de casos escolares"
                            sizes="(min-width: 1024px) 460px, 100vw"
                            aspect="aspect-[16/10]"
                            className="mt-8"
                        />
                    </Reveal>
                    <ol className="border-t border-[#d8cfc0]">
                        {method.map((step, index) => (
                            <li key={step.title} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-b border-[#d8cfc0] py-6">
                                <span className="text-[0.9375rem] font-semibold tabular-nums text-[#9f5528]">{String(index + 1).padStart(2, "0")}</span>
                                <Reveal delay={index * 0.05}>
                                    <h3 className="crc-serif text-[1.35rem] font-medium leading-[1.2] text-[#171713]">{step.title}</h3>
                                    <p className="mt-2 text-[1rem] leading-[1.7] text-[#55574f]">{step.text}</p>
                                </Reveal>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Evidencia pública */}
            <section aria-labelledby="evidencia-title" className="border-t border-[#d8cfc0] bg-[#f8f5ee]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16`}>
                    <Reveal>
                        <SectionHead eyebrow="Evidencia pública" title="La exigencia de trazabilidad ya aparece en fallos y prensa." id="evidencia-title" />
                        <Link href="/servicios/compliance-escolar#evidencia" className={`${textLink} mt-6`}>
                            Ver más fallos recientes
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </Reveal>
                    <Reveal>
                        <ul className="border-t border-[#d8cfc0]">
                            {evidence.map((item) => (
                                <li key={item.title} className="border-b border-[#d8cfc0]">
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group grid gap-2 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-6"
                                    >
                                        <span className="crc-serif text-[1.5rem] font-medium leading-none tabular-nums text-[#9f5528]">{item.stat}</span>
                                        <span>
                                            <span className="crc-serif block text-[1.2rem] font-medium leading-[1.3] text-[#171713] transition-colors group-hover:text-[#9f5528]">
                                                {item.title}
                                            </span>
                                            <span className="mt-2 inline-flex items-center gap-1 text-[0.875rem] font-semibold text-[#6f675d]">
                                                Fuente: {item.source}
                                                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                                            </span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            <EngagementList
                engagements={[BIENESTAR_CONVIVENCIA]}
                className="border-t border-[#d8cfc0] bg-[#fffdf8]"
                eyebrow="Compromiso"
                title="Un compromiso para que el colegio responda sin improvisar"
                intro={
                    <p>
                        Si el foco es el cumplimiento de la Ley 21.809 (protocolos, registros y fiscalización), conviene partir por el{" "}
                        <Link href="/servicios/compliance-escolar#compromisos" className="font-semibold text-[#9f5528] underline decoration-[#d8cfc0] underline-offset-4 hover:text-[#171713]">
                            diagnóstico de cumplimiento
                        </Link>
                        .
                    </p>
                }
            />

            {/* Resultado esperado */}
            <section aria-labelledby="resultado-title" className="border-t border-[#d8cfc0] bg-[#f8f5ee]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16`}>
                    <Reveal>
                        <SectionHead eyebrow="Resultado esperado" title="Capacidad institucional para responder sin improvisar." id="resultado-title" />
                    </Reveal>
                    <Reveal>
                        <ul className="border-t border-[#d8cfc0]">
                            {outcomes.map((item) => (
                                <li key={item} className="border-b border-[#d8cfc0] py-4 text-[1rem] leading-[1.6] text-[#171713]">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            <PersonInCharge
                person={HUGO}
                className="bg-[#fffdf8]"
                cta={{ href: "/instituciones?servicio=bienestar-escolar#agenda", label: "Agenda 20 minutos con Hugo" }}
            >
                <p>
                    Hugo coordina el trabajo con cada colegio: diagnóstico, propuesta, convenio y medición de lo acordado. La parte
                    clínica del acompañamiento (salud mental, riesgo suicida y supervisión de casos) la dirige Rocío Solar, Directora
                    Clínica del CRC.
                </p>
            </PersonInCharge>
        </main>
    );
}
