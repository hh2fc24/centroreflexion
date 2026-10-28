import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, ExternalLink } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { books } from "@/lib/books";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/contact";
import { HUGO, JUAN_CARLOS, ROCIO, type Person } from "@/app/servicios/_components/people";

export const metadata: Metadata = pageMetadata({
    title: "Sala de prensa",
    description:
        "Voceros, temas, fotografías, logos y contacto de prensa del Centro de Reflexiones Críticas (CRC): niñez, salud mental infanto-juvenil, sistema de protección y convivencia escolar.",
    path: "/prensa",
});

/**
 * Sala de prensa: lo primero que piden periodistas y productores cuando el
 * centro gana exposición pública. Todo lo necesario para escribir una nota
 * o invitar a un vocero sin tener que escribir antes.
 */

const label = "text-[0.8125rem] font-semibold text-[#9f5528]";
const h2 = "crc-serif text-balance text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-[#171713]";
const container = "mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12";
const textLink =
    "inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-[#171713] underline decoration-[#bd6f3c] underline-offset-[6px] transition-colors hover:text-[#9f5528]";

type Spokesperson = { person: Person; topics: string[]; bio: string };

const SPOKESPEOPLE: Spokesperson[] = [
    {
        person: JUAN_CARLOS,
        topics: [
            "Desprotección infantil y sistema de protección",
            "Tecnocracia y neoliberalismo en las políticas de infancia",
            "Salud mental infantil, medicalización y suplicio",
            "Institucionalización y responsabilidad del Estado",
        ],
        bio: "Trabajador social (UTEM), magíster en Filosofía Política Contemporánea (UDP) y doctorando en Trabajo Social en la Universitat Rovira i Virgili, España. Director del CRC, columnista de opinión y autor de tres libros que analizan críticamente cómo el Estado chileno gobierna la infancia pobre bajo una racionalidad neoliberal y tecnocrática.",
    },
    {
        person: ROCIO,
        topics: [
            "Salud mental infanto-juvenil",
            "Crisis y regulación emocional en niñez y adolescencia",
            "Acompañamiento a familias",
        ],
        bio: "Terapeuta ocupacional y académica, con 9 años de experiencia clínica y psicosocial en salud mental infanto-juvenil en dispositivos públicos, atención particular y programas especializados.",
    },
    {
        person: HUGO,
        topics: [
            "Convivencia escolar y Ley 21.809",
            "Gestión e indicadores en programas sociales",
            "Tecnología y datos aplicados a instituciones",
        ],
        bio: "Ingeniero comercial, fundador de Altius Ignite. Más de 15 años en operaciones, inteligencia de negocio y transformación digital; en el CRC dirige el desarrollo institucional y los convenios.",
    },
];

/**
 * Contenido del kit de prensa de Juan Carlos Rauld (octubre de 2026). El PDF
 * en /docs/kit-de-prensa-juan-carlos-rauld.pdf es la versión corregida y
 * diagramada por el CRC a partir del Word original; si el kit cambia, se
 * actualizan juntos el PDF y estos textos.
 */
const PRESS_KIT_PDF = "/docs/kit-de-prensa-juan-carlos-rauld.pdf";

const HEADLINE = "Chile gobierna a su infancia pobre con tecnocracia, no con cuidado.";

const CORE_IDEA =
    "La infancia pobre en Chile no está abandonada por el Estado, sino gobernada bajo una racionalidad neoliberal y tecnocrática que administra el sufrimiento en nombre de la protección. Lo que viven los niños, niñas y adolescentes es inclasificable: está más allá del trauma y solo es posible tematizarlo desde una filosofía de la infancia, a través de un concepto central que Rauld denomina suplicio.";

const QUOTES = [
    "La desprotección infantil no es ausencia del Estado, sino una forma específica de intervención.",
    "En Chile los niños no están fuera del sistema de protección; están atrapados en él.",
    "Cuando el cuidado se vuelve solo técnico, deja de ser cuidado.",
    "La forma en que una sociedad trata a sus niños revela su proyecto político.",
];

const KEY_IDEAS = [
    "La desprotección infantil se expresa como sobreintervención institucional.",
    "El neoliberalismo gobierna la infancia como riesgo social e inversión futura.",
    "La tecnocracia ha despolitizado el cuidado y desplazado la ética.",
    "El sufrimiento infantil es una trayectoria institucional prolongada.",
    "El Estado interviene de forma fragmentada, sin responsabilidad política clara.",
    "La forma de tratar a la infancia revela qué vidas importan en una sociedad.",
];

const CLOSING =
    "Chile no necesita más diagnósticos técnicos sobre la infancia; necesita politizar el cuidado y asumir responsabilidad por el daño que produce.";

const FEATURED_COVERAGE = [
    {
        outlet: "El Mostrador",
        date: "5 de abril de 2026",
        title: "Juan Carlos Rauld: “El Estado desprotege. Es una intervención cara con malos resultados”",
        href: "https://www.elmostrador.cl/agenda-pais/ninez/2026/04/05/juan-carlos-rauld-el-estado-desprotege-es-una-intervencion-cara-con-malos-resultados/",
    },
    {
        outlet: "El Mostrador",
        date: "21 de julio de 2024",
        title: "Crisis de información: el Estado no sabe cuántos niños “desaparecen” de su cuidado",
        href: "https://www.elmostrador.cl/noticias/pais/2024/07/21/crisis-de-informacion-el-estado-no-sabe-cuantos-ninos-desaparecen-de-su-cuidado/",
    },
];

const BOILERPLATE =
    "El Centro de Reflexiones Críticas (CRC) es un centro de estudios y consultoría chileno dedicado al pensamiento crítico y a la salud mental de la niñez y juventud. Trabaja con colegios, programas de protección, fundaciones, municipios y profesionales a través de investigación, formación, consultoría institucional y atención clínica. Su director, Juan Carlos Rauld, es autor de tres libros publicados por Editorial Hammurabi.";

export default function PrensaPage() {
    return (
        <div className="bg-[#f8f5ee] text-[#171713]">
            {/* Encabezado + contacto de prensa */}
            <section className="border-b border-[#d8cfc0]">
                <div className={`${container} grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16`}>
                    <div>
                        <p className={label}>Sala de prensa</p>
                        <h1 className="crc-serif mt-4 max-w-[22ch] text-balance text-[clamp(2rem,3.2vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.01em]">
                            Voceros, temas y material para medios
                        </h1>
                        <p className="mt-6 max-w-[60ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">
                            Para periodistas, productores y editores que cubren niñez, salud mental, sistema de protección y
                            educación. Aquí están los voceros del CRC, los temas que cada uno aborda, fotografías y logos en
                            alta resolución.
                        </p>
                    </div>
                    <div className="border-t border-[#d8cfc0] pt-6">
                        <p className="text-[0.9375rem] font-semibold">Contacto de prensa</p>
                        <p className="mt-2 text-[0.9375rem] leading-[1.6] text-[#55574f]">
                            Solicitudes de entrevista, columnas de opinión y vocerías.
                        </p>
                        <ul className="mt-4 space-y-1 text-[0.9375rem]">
                            <li>
                                <a href={`mailto:${CONTACT_EMAIL}?subject=Solicitud%20de%20prensa`} className={textLink}>
                                    {CONTACT_EMAIL}
                                </a>
                            </li>
                            <li>
                                <a href={CONTACT_PHONE_HREF} className={textLink}>
                                    {CONTACT_PHONE}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Voceros */}
            <section aria-labelledby="voceros" className="bg-[#fffdf8]">
                <div className={`${container} py-16 sm:py-24`}>
                    <p className={label}>Voceros</p>
                    <h2 id="voceros" className={`${h2} mt-3`}>
                        Quién puede hablar de qué
                    </h2>
                    <ul className="mt-12 border-t border-[#d8cfc0]">
                        {SPOKESPEOPLE.map(({ person, topics, bio }) => (
                            <li
                                key={person.name}
                                className="grid gap-6 border-b border-[#d8cfc0] py-10 md:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)] md:gap-10"
                            >
                                <div>
                                    <div className="relative aspect-[4/5] w-full max-w-[180px] overflow-hidden rounded-[6px] bg-[#eee8dc]">
                                        <Image src={person.image} alt={person.imageAlt} fill sizes="180px" className="object-cover object-top" />
                                    </div>
                                    <a href={person.image} download className={`${textLink} mt-2 text-[0.875rem]`}>
                                        <Download className="h-4 w-4" aria-hidden="true" />
                                        Descargar foto
                                    </a>
                                </div>
                                <div>
                                    <h3 className="crc-serif text-[1.45rem] font-medium leading-[1.2]">{person.name}</h3>
                                    <p className="mt-1 text-[0.9375rem] font-semibold text-[#9f5528]">{person.role}</p>
                                    <p className="mt-4 max-w-[60ch] text-[0.9375rem] leading-[1.7] text-[#55574f]">{bio}</p>
                                </div>
                                <div>
                                    <p className="text-[0.875rem] font-semibold">Temas</p>
                                    <ul className="mt-3 space-y-2">
                                        {topics.map((topic) => (
                                            <li key={topic} className="border-l-2 border-[#d8cfc0] pl-3 text-[0.9375rem] leading-[1.5] text-[#171713]">
                                                {topic}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Kit de prensa del director */}
            <section aria-labelledby="kit-director" className="border-t border-[#d8cfc0]">
                <div className={`${container} py-16 sm:py-24`}>
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                        <div>
                            <p className={label}>Kit de prensa · Juan Carlos Rauld</p>
                            <h2 id="kit-director" className={`${h2} mt-3 max-w-[26ch]`}>
                                Ideas y frases para entrevistas
                            </h2>
                        </div>
                        <a href={PRESS_KIT_PDF} download className={textLink}>
                            <Download className="h-4 w-4" aria-hidden="true" />
                            Descargar kit de prensa (PDF)
                        </a>
                    </div>

                    <figure className="mt-12 border-l-2 border-[#bd6f3c] pl-6">
                        <blockquote className="crc-serif max-w-[30ch] text-balance text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.2]">
                            “{HEADLINE}”
                        </blockquote>
                        <figcaption className="mt-3 text-[0.875rem] text-[#6f675d]">Frase para titular</figcaption>
                    </figure>

                    <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
                        <div>
                            <p className="text-[0.875rem] font-semibold">Idea matriz</p>
                            <p className="mt-3 max-w-[60ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">{CORE_IDEA}</p>

                            <p className="mt-10 text-[0.875rem] font-semibold">Frases citables</p>
                            <ul className="mt-3 border-t border-[#d8cfc0]">
                                {QUOTES.map((quote) => (
                                    <li key={quote} className="crc-serif border-b border-[#d8cfc0] py-4 text-[1.125rem] leading-[1.45]">
                                        “{quote}”
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-[0.875rem] font-semibold">Ideas fuerza</p>
                            <ul className="mt-3 space-y-3">
                                {KEY_IDEAS.map((idea) => (
                                    <li key={idea} className="border-l-2 border-[#d8cfc0] pl-3 text-[0.9375rem] leading-[1.6] text-[#171713]">
                                        {idea}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-10 text-[0.875rem] font-semibold">Cierre</p>
                            <p className="mt-3 max-w-[60ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">{CLOSING}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cobertura */}
            <section aria-labelledby="cobertura" className="border-t border-[#d8cfc0]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16`}>
                    <div>
                        <p className={label}>En los medios</p>
                        <h2 id="cobertura" className={`${h2} mt-3`}>
                            Cobertura reciente
                        </h2>
                        <Link href="/publicaciones#medios-publicaciones" className={`${textLink} mt-6`}>
                            Ver todas las apariciones
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </div>
                    <ul className="border-t border-[#d8cfc0]">
                        {FEATURED_COVERAGE.map((item) => (
                            <li key={item.href} className="border-b border-[#d8cfc0]">
                                <a href={item.href} target="_blank" rel="noopener noreferrer" className="group block py-6">
                                    <p className="text-[0.875rem] text-[#6f675d]">
                                        <span className="font-semibold text-[#171713]">{item.outlet}</span> · {item.date}
                                    </p>
                                    <p className="crc-serif mt-2 text-[1.2rem] leading-[1.35] group-hover:text-[#9f5528]">
                                        {item.title}
                                        <ExternalLink className="ml-2 inline h-4 w-4 align-[-2px] text-[#9f5528]" aria-label="(abre en otra pestaña)" />
                                    </p>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Kit de marca y descripción */}
            <section aria-labelledby="kit" className="border-t border-[#d8cfc0] bg-[#fffdf8]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16`}>
                    <div>
                        <p className={label}>Kit de marca</p>
                        <h2 id="kit" className={`${h2} mt-3`}>
                            Logo y descripción institucional
                        </h2>
                        <div className="mt-8 flex items-center gap-5">
                            <div className="relative h-24 w-24 shrink-0 rounded-[6px] border border-[#d8cfc0] bg-[#f8f5ee] p-2">
                                <Image src="/logo-crc.png" alt="Logo del Centro de Reflexiones Críticas" fill sizes="96px" className="object-contain p-2" />
                            </div>
                            <a href="/logo-crc.png" download="logo-centro-reflexiones-criticas.png" className={textLink}>
                                <Download className="h-4 w-4" aria-hidden="true" />
                                Descargar logo (PNG, 1024 px)
                            </a>
                        </div>
                    </div>
                    <div>
                        <p className="text-[0.875rem] font-semibold">Descripción para notas de prensa</p>
                        <p className="mt-3 rounded-[6px] border border-[#d8cfc0] bg-[#f8f5ee] p-5 text-[1rem] leading-[1.7]">{BOILERPLATE}</p>

                        <p className="mt-10 text-[0.875rem] font-semibold">Libros del director</p>
                        <ul className="mt-3 border-t border-[#d8cfc0]">
                            {books.map((book) => (
                                <li key={book.title} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[#d8cfc0] py-3 text-[0.9375rem]">
                                    <span>
                                        <span className="crc-serif font-medium">{book.title}</span>
                                        <span className="text-[#6f675d]"> · {book.subtitle}</span>
                                    </span>
                                    <span className="tabular-nums text-[#6f675d]">Editorial Hammurabi, {book.year}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Declaraciones */}
            <section className="border-t border-[#d8cfc0] bg-[#eee8dc]">
                <div className={`${container} flex flex-col gap-6 py-14 lg:flex-row lg:items-end lg:justify-between lg:py-20`}>
                    <div className="max-w-[52ch]">
                        <p className={label}>Posición institucional</p>
                        <h2 className={`${h2} mt-3`}>Declaraciones públicas del CRC</h2>
                        <p className="mt-4 text-[1.0625rem] leading-[1.7] text-[#55574f]">
                            Las declaraciones firmadas por la dirección del centro, con video y texto completo.
                        </p>
                    </div>
                    <Link
                        href="/declaracion-publica/ninez-migrante-haitiana"
                        className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[6px] border border-[#171713] px-5 py-2.5 text-[0.9375rem] font-semibold transition-colors hover:bg-[#171713] hover:text-[#fffdf8]"
                    >
                        Ver la declaración sobre niñez migrante
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
