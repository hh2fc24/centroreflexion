import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarCheck, Linkedin } from "lucide-react";
import { books } from "@/lib/books";
import { EngagementIndex, SectionHead } from "@/app/servicios/_components/Blocks";
import { INSTITUTIONAL_ENGAGEMENTS, VALUE_NOTE } from "@/app/servicios/_components/engagements";
import { HUGO, JUAN_CARLOS, ROCIO, type Person } from "@/app/servicios/_components/people";
import { Reveal } from "@/app/servicios/_components/Reveal";
import { btnPrimary, container, h1, label, labelMuted, lead, textLink } from "@/app/servicios/_components/ui";
import { InstitucionesContactForm, InstitucionesWhatsAppLink } from "./InstitucionesContact";

/**
 * Secciones de /instituciones. Sin GSAP: el único movimiento es la aparición
 * sutil de <Reveal>, que respeta prefers-reduced-motion y deja el HTML completo
 * visible sin JavaScript.
 */

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const AUDIENCES = [
    "Direcciones de colegios y sostenedores",
    "Programas PIE, PRM, PPF, DAM y OPD",
    "Oficinas locales de niñez",
    "Fundaciones y ONG de infancia",
    "Municipios",
];

function Hero() {
    return (
        <section aria-labelledby="inst-hero-title" className="border-b border-[#d8cfc0] bg-[#f8f5ee]">
            <div className={`${container} grid gap-12 pb-16 pt-14 sm:pb-24 sm:pt-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] lg:items-end lg:gap-16`}>
                <div>
                    <p className={label}>Para instituciones</p>
                    <h1 id="inst-hero-title" className={`${h1} mt-4 max-w-[20ch] text-[#171713]`}>
                        Criterio experto para decisiones difíciles sobre infancia
                    </h1>
                    <p className={`${lead} mt-6 max-w-[58ch]`}>
                        Hay decisiones en que la ley, el caso y la institución empujan hacia lados distintos. Ayudamos a colegios,
                        programas de protección, fundaciones y municipios a decidir con fundamento y a dejarlo registrado.
                    </p>
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                        <a href="#agenda" className={btnPrimary}>
                            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                            Agenda 20 minutos con Hugo
                        </a>
                        <a href="#oferta" className={textLink}>
                            Ver la oferta
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                    </div>
                </div>

                <div className="border-t border-[#d8cfc0] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                    <p className={labelMuted}>Con quién trabajamos</p>
                    <ul className="mt-3">
                        {AUDIENCES.map((item) => (
                            <li
                                key={item}
                                className="crc-serif border-b border-[#d8cfc0] py-3 text-[1.15rem] font-medium leading-[1.3] text-[#171713] last:border-b-0"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Oferta: compromisos con nombre                                      */
/* ------------------------------------------------------------------ */

function Offers() {
    return (
        <section id="oferta" aria-labelledby="inst-oferta-title" className="scroll-mt-24 bg-[#fffdf8]">
            <div className={`${container} py-16 sm:py-24`}>
                <Reveal className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16">
                    <SectionHead eyebrow="Oferta" title="Compromisos con nombre, alcance y entregable" id="inst-oferta-title" />
                    <p className="max-w-[46ch] text-[1rem] leading-[1.7] text-[#55574f]">
                        Se contratan por separado. Lo habitual es partir por un diagnóstico y definir juntos qué conviene.{" "}
                        <span className="font-semibold text-[#171713]">{VALUE_NOTE}:</span> la propuesta económica llega con el
                        alcance acordado.
                    </p>
                </Reveal>
                <Reveal className="mt-12">
                    <EngagementIndex engagements={INSTITUTIONAL_ENGAGEMENTS} />
                </Reveal>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Cómo trabajamos                                                     */
/* ------------------------------------------------------------------ */

const STEPS = [
    {
        name: "Diagnóstico",
        text: "Conversamos con la dirección y el equipo, revisamos documentos, registros y algunos casos tipo.",
        receives: "Un informe breve con brechas, riesgos y prioridades.",
        duration: "Habitualmente 2 a 3 semanas",
    },
    {
        name: "Propuesta",
        text: "Convertimos el diagnóstico en un plan con alcance, responsables, entregables y costo.",
        receives: "Propuesta técnica y económica con cronograma.",
        duration: "Habitualmente 1 semana",
    },
    {
        name: "Implementación",
        text: "Formación, supervisión, ajuste de protocolos o acompañamiento de casos, según lo acordado.",
        receives: "Sesiones realizadas, documentos ajustados y registro de lo trabajado.",
        duration: "Habitualmente entre 1 y 4 meses, según el alcance",
    },
    {
        name: "Medición",
        text: "Volvemos a los indicadores del diagnóstico para ver qué cambió y qué falta.",
        receives: "Informe de cierre con resultados y recomendaciones.",
        duration: "Habitualmente 2 semanas al cierre",
    },
];

function Process() {
    return (
        <section id="como-trabajamos" aria-labelledby="inst-proceso-title" className="scroll-mt-24 bg-[#15120e] text-[#fbf7ee]">
            <div className={`${container} py-16 sm:py-24`}>
                <Reveal>
                    <SectionHead eyebrow="Cómo trabajamos" title="Cuatro pasos, un entregable en cada uno" id="inst-proceso-title" dark>
                        Los plazos son los habituales para un colegio o un programa. Se ajustan al tamaño de la institución y a lo que
                        se acuerde en la propuesta.
                    </SectionHead>
                </Reveal>

                <ol className="mt-12 grid border-t border-white/15 md:grid-cols-2 xl:grid-cols-4">
                    {STEPS.map((step, index) => (
                        <li
                            key={step.name}
                            className="border-b border-white/15 py-8 md:pr-8 xl:border-b-0 xl:border-l xl:px-6 xl:first:border-l-0 xl:first:pl-0"
                        >
                            <Reveal delay={index * 0.06}>
                                <p className="text-[0.8125rem] font-semibold tabular-nums text-[#e4935d]">Paso {index + 1}</p>
                                <h3 className="crc-serif mt-2 text-[1.5rem] font-medium leading-[1.15]">{step.name}</h3>
                                <p className="mt-3 text-[0.9375rem] leading-[1.65] text-[#ede7dc]/80">{step.text}</p>
                                <p className="mt-5 text-[0.8125rem] font-semibold text-[#ede7dc]/60">Qué recibe la institución</p>
                                <p className="mt-1 text-[0.9375rem] leading-[1.6] text-[#fbf7ee]">{step.receives}</p>
                                <p className="mt-4 text-[0.875rem] font-semibold text-[#e4935d]">{step.duration}</p>
                            </Reveal>
                        </li>
                    ))}
                </ol>

                <Reveal className="mt-12 grid gap-6 border-t border-white/15 pt-10 sm:grid-cols-[72px_minmax(0,1fr)] sm:items-start">
                    <span className="relative block h-[72px] w-[72px] overflow-hidden rounded-[6px] bg-[#f8f5ee]">
                        <Image src={HUGO.image} alt="" fill sizes="72px" className="object-cover object-top" />
                    </span>
                    <figure>
                        <blockquote className="crc-serif max-w-[46ch] text-[1.3rem] leading-[1.4] text-[#fbf7ee]">
                            “Coordino este proceso de principio a fin: el alcance, los plazos, el contrato y la medición. Si algo no está
                            funcionando, me lo dicen a mí.”
                        </blockquote>
                        <figcaption className="mt-4 text-[0.9375rem]">
                            <span className="font-semibold text-white">{HUGO.name}</span>
                            <span className="text-[#ede7dc]/70"> · {HUGO.role}</span>
                        </figcaption>
                    </figure>
                </Reveal>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Respaldo: las tres personas que dirigen el CRC                      */
/* ------------------------------------------------------------------ */

// Del más reciente al más antiguo.
const BOOKS = [...books].sort((a, b) => Number(b.year) - Number(a.year));

const DIRECTORS: { person: Person; area: string; text: string }[] = [
    {
        person: JUAN_CARLOS,
        area: "Formación y seminarios",
        text: "Trabajador social con 16 años dirigiendo programas de infancia y gestión pública en Chile, y autor de tres libros con Editorial Hammurabi.",
    },
    {
        person: ROCIO,
        area: "Clínica y supervisión de casos",
        text: "Terapeuta ocupacional con 9 años de práctica clínica y psicosocial en salud mental infanto-juvenil, con niños, niñas, adolescentes y sus familias.",
    },
    {
        person: HUGO,
        area: "Compliance, consultoría y convenios",
        text: "Arma el diagnóstico, la propuesta y el convenio con cada institución, y se asegura de que lo acordado se implemente y se mida.",
    },
];

function Proof() {
    return (
        <section aria-labelledby="inst-respaldo-title" className="border-b border-[#d8cfc0] bg-[#f8f5ee]">
            <div className={`${container} py-16 sm:py-24`}>
                <Reveal>
                    <SectionHead eyebrow="Respaldo" title="Quiénes están detrás del criterio" id="inst-respaldo-title">
                        Tres directores, cada uno a cargo de un área. Con ellos trabaja la institución, no con un equipo de ventas.
                    </SectionHead>
                </Reveal>

                <ul className="mt-12 grid gap-10 border-t border-[#d8cfc0] pt-10 md:grid-cols-3 md:gap-8">
                    {DIRECTORS.map(({ person, area, text }, index) => (
                        <li key={person.name}>
                            <Reveal delay={index * 0.06}>
                                <div className="relative aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-[6px] bg-white ring-1 ring-[#d8cfc0] md:max-w-none">
                                    <Image
                                        src={person.image}
                                        alt={person.imageAlt}
                                        fill
                                        sizes="(min-width: 768px) 30vw, 280px"
                                        className="object-cover object-top"
                                    />
                                </div>
                                <p className="mt-5 text-[0.8125rem] font-semibold text-[#9f5528]">{area}</p>
                                <p className="crc-serif mt-1 text-[1.4rem] font-medium leading-[1.2] text-[#171713]">{person.name}</p>
                                <p className="mt-1 text-[0.9375rem] font-semibold text-[#171713]">{person.role}</p>
                                <p className="mt-3 max-w-[40ch] text-[0.9375rem] leading-[1.65] text-[#55574f]">{text}</p>
                            </Reveal>
                        </li>
                    ))}
                </ul>

                <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
                    <Reveal>
                        <p className={labelMuted}>Libros de Juan Carlos Rauld · Editorial Hammurabi</p>
                        <ul className="mt-3 border-t border-[#d8cfc0]">
                            {BOOKS.map((book) => (
                                <li key={book.title} className="border-b border-[#d8cfc0]">
                                    <a
                                        href={book.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713]"
                                    >
                                        <span>
                                            <span className="crc-serif block text-[1.25rem] font-medium leading-tight text-[#171713] transition-colors group-hover:text-[#9f5528]">
                                                {book.title}
                                            </span>
                                            <span className="mt-1 block text-[0.9375rem] text-[#55574f]">{book.subtitle}</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 text-[0.875rem] font-semibold tabular-nums text-[#9f5528]">
                                            {book.year}
                                            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Reveal>

                    <Reveal className="border-l-2 border-[#bd6f3c] pl-6 lg:self-start">
                        <p className={label}>Lo que ya dicen los tribunales</p>
                        <p className="mt-2 text-[1rem] leading-[1.7] text-[#55574f]">
                            Fallos recientes condenan a colegios que tenían protocolo pero no lo aplicaron a tiempo. Tener el documento
                            no basta.
                        </p>
                        <Link href="/servicios/compliance-escolar#evidencia" className={`${textLink} mt-4`}>
                            Ver los fallos
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Agenda                                                              */
/* ------------------------------------------------------------------ */

function Agenda() {
    return (
        <section id="agenda" aria-labelledby="inst-agenda-title" className="scroll-mt-24 bg-[#fffdf8]">
            <div className={`${container} grid gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16`}>
                <Reveal>
                    <SectionHead eyebrow="Agenda" title="20 minutos para ver si podemos ayudar" id="inst-agenda-title" />

                    <div className="mt-10 grid grid-cols-[112px_minmax(0,1fr)] items-end gap-5 sm:grid-cols-[152px_minmax(0,1fr)]">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-white ring-1 ring-[#d8cfc0]">
                            <Image src={HUGO.image} alt={HUGO.imageAlt} fill sizes="(max-width: 640px) 112px, 152px" className="object-cover object-top" />
                        </div>
                        <div>
                            <p className="crc-serif text-[1.4rem] font-medium leading-tight text-[#171713]">{HUGO.name}</p>
                            <p className="mt-1.5 text-[0.9375rem] font-semibold leading-[1.45] text-[#9f5528]">{HUGO.role}</p>
                            <a
                                href={HUGO.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex min-h-10 items-center gap-1.5 text-[0.9375rem] font-semibold text-[#55574f] transition-colors hover:text-[#9f5528]"
                            >
                                <Linkedin className="h-4 w-4" aria-hidden="true" />
                                LinkedIn
                            </a>
                        </div>
                    </div>

                    <p className="crc-serif mt-8 max-w-[38ch] text-[1.25rem] leading-[1.45] text-[#171713]">
                        “Soy quien conversa con las instituciones sobre implementación, medición y contratos. En 20 minutos entiendo qué
                        necesitan y les digo con franqueza si el CRC es la ayuda correcta.”
                    </p>

                    <div className="mt-8">
                        <InstitucionesWhatsAppLink />
                    </div>
                </Reveal>

                <Reveal className="rounded-[6px] border border-[#d8cfc0] bg-[#f8f5ee] p-5 sm:p-8">
                    <p className={`${labelMuted} mb-5`}>Pedir la reunión</p>
                    <InstitucionesContactForm />
                </Reveal>
            </div>
        </section>
    );
}

export function InstitucionesSections() {
    return (
        <>
            <Hero />
            <Offers />
            <Process />
            <Proof />
            <Agenda />
        </>
    );
}
