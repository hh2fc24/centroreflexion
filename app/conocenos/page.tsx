import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, GraduationCap, Linkedin, Workflow } from "lucide-react";
import { Reveal } from "@/app/servicios/_components/Reveal";
import { btnPrimary, container, h1, h2, label, labelMuted, lead, textLink } from "@/app/servicios/_components/ui";

/**
 * /conocenos: los directores tienen el mismo peso visual (mismo retrato,
 * misma escala de nombre, mismo orden de bloques). El orden sigue el de la
 * portada: Juan Carlos, Hugo.
 */

type Director = {
    id: string;
    name: string;
    role: string;
    area: string;
    degree: string;
    image: string;
    summary: string;
    links: { href: string; label: string; icon: ReactNode; external?: boolean }[];
};

const DIRECTORS: Director[] = [
    {
        id: "juan-carlos-rauld",
        name: "Juan Carlos Rauld",
        role: "Director del CRC · Consultor en ciencias sociales",
        area: "Formación, seminarios e investigación",
        degree: "Doctorando en Trabajo Social, Universidad Rovira i Virgili, España",
        image: "/images/juan_carlos_real_white.png",
        summary: "Trauma psíquico infantil, filosofía de la infancia y calidad de la intervención con niños, niñas y adolescentes.",
        links: [
            { href: "https://uc-cl.academia.edu/JUANCARLOSRAULDFAR%C3%8DAS", label: "Academia.edu", icon: <GraduationCap className="h-4 w-4" aria-hidden="true" />, external: true },
            { href: "https://www.linkedin.com/in/juan-carlos-rauld-farias-a64710a4/", label: "LinkedIn", icon: <Linkedin className="h-4 w-4" aria-hidden="true" />, external: true },
        ],
    },
    {
        id: "hugo-hormazabal",
        name: "Hugo Felipe Hormazábal",
        role: "Socio · Director Comercial y de Desarrollo Institucional",
        area: "Instituciones, convenios y medición",
        degree: "Ingeniero Comercial · Fundador de Altius Ignite",
        image: "/images/hugo-hormazabal-crc-2026-large.png",
        summary: "La persona con quien conversan colegios, programas, fundaciones y municipios: diagnóstico, propuesta, convenio y medición.",
        links: [
            { href: "https://www.linkedin.com/in/hugo-felipe-hormazabal-561005332/", label: "LinkedIn", icon: <Linkedin className="h-4 w-4" aria-hidden="true" />, external: true },
            { href: "https://www.altiusignite.com", label: "Altius Ignite", icon: <Workflow className="h-4 w-4" aria-hidden="true" />, external: true },
        ],
    },
];

const bodyText = "text-[1rem] leading-[1.7] text-[#55574f]";
const blockTitle = "crc-serif border-b border-[#d8cfc0] pb-2 text-[1.35rem] font-medium leading-[1.2] text-[#171713]";

function Portrait({ director, sizes }: { director: Director; sizes: string }) {
    return (
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[6px] bg-white ring-1 ring-[#d8cfc0]">
            <Image src={director.image} alt={director.name} fill sizes={sizes} className="object-cover object-top" />
        </div>
    );
}

function ProfileLinks({ director }: { director: Director }) {
    return (
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {director.links.map((link) => (
                <li key={link.label}>
                    {link.external ? (
                        <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-10 items-center gap-1.5 text-[0.9375rem] font-semibold text-[#55574f] transition-colors hover:text-[#9f5528]"
                        >
                            {link.icon}
                            {link.label}
                        </a>
                    ) : (
                        <Link href={link.href} className="inline-flex min-h-10 items-center gap-1.5 text-[0.9375rem] font-semibold text-[#55574f] transition-colors hover:text-[#9f5528]">
                            {link.icon}
                            {link.label}
                        </Link>
                    )}
                </li>
            ))}
        </ul>
    );
}

/** Perfil completo: misma estructura para los directores. */
function Profile({ director, children, aside }: { director: Director; children: ReactNode; aside?: ReactNode }) {
    return (
        <article id={director.id} aria-labelledby={`${director.id}-name`} className="scroll-mt-24 border-t border-[#d8cfc0] py-14 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
                <Reveal>
                    <div className="max-w-[300px]">
                        <Portrait director={director} sizes="300px" />
                    </div>
                    <p className="mt-5 text-[0.8125rem] font-semibold text-[#9f5528]">{director.area}</p>
                    <h3 id={`${director.id}-name`} className="crc-serif mt-1 text-[1.75rem] font-medium leading-[1.15] text-[#171713]">
                        {director.name}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] font-semibold leading-[1.45] text-[#171713]">{director.role}</p>
                    <p className="mt-1 text-[0.875rem] leading-[1.55] text-[#6f675d]">{director.degree}</p>
                    <ProfileLinks director={director} />
                    {aside}
                </Reveal>
                <Reveal className="max-w-[68ch] space-y-10">{children}</Reveal>
            </div>
        </article>
    );
}

export default function About() {
    const [jc, hugo] = DIRECTORS;

    return (
        <main className="bg-[#fffdf8] text-[#171713]">
            {/* Hero */}
            <section aria-labelledby="conocenos-title" className="border-b border-[#d8cfc0] bg-[#f8f5ee]">
                <div className={`${container} grid gap-10 pb-14 pt-14 sm:pb-20 sm:pt-20 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-end lg:gap-16`}>
                    <div>
                        <p className={label}>Conócenos</p>
                        <h1 id="conocenos-title" className={`${h1} mt-4 max-w-[22ch] text-[#171713]`}>
                            Un equipo interdisciplinario para pensar, cuidar e intervenir con rigor
                        </h1>
                        <p className={`${lead} mt-6 max-w-[60ch]`}>
                            El CRC reúne trayectorias distintas para leer problemas complejos con rigor, sensibilidad institucional y
                            responsabilidad ética. Lo dirigen dos socios, cada uno a cargo de su área.
                        </p>
                    </div>
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[6px] bg-[#eee8dc] lg:aspect-[4/3]">
                        <Image src="/images/hero_crc_library.jpg" alt="" fill priority sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" />
                    </div>
                </div>
            </section>

            {/* Enfoque */}
            <section aria-labelledby="enfoque-title" className="bg-[#fffdf8]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16`}>
                    <Reveal>
                        <p className={label}>Nuestro enfoque</p>
                        <h2 id="enfoque-title" className={`${h2} mt-3 text-[#171713]`}>
                            Pensamiento crítico con práctica situada.
                        </h2>
                        <p className="mt-6 text-[0.9375rem] text-[#6f675d]">Rigor · Cuidado · Interdisciplina · Evidencia · Contexto</p>
                    </Reveal>
                    <Reveal>
                        <dl className="border-t border-[#d8cfc0]">
                            <div className="grid gap-2 border-b border-[#d8cfc0] py-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
                                <dt className={labelMuted}>Misión</dt>
                                <dd className="text-[1.0625rem] leading-[1.7] text-[#171713]">
                                    Cultivar un espacio de pensamiento crítico, formación y práctica profesional orientado a la salud mental de
                                    la niñez y juventud, la educación y las instituciones que sostienen la vida común.
                                </dd>
                            </div>
                            <div className="grid gap-2 border-b border-[#d8cfc0] py-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
                                <dt className={labelMuted}>Visión</dt>
                                <dd className="text-[1.0625rem] leading-[1.7] text-[#171713]">
                                    Consolidar una comunidad interdisciplinaria capaz de articular ciencias sociales, clínica, salud mental,
                                    educación, gestión y tecnología desde una mirada ética, situada y rigurosa.
                                </dd>
                            </div>
                        </dl>
                    </Reveal>
                </div>
            </section>

            {/* Equipo base: directores con el mismo peso */}
            <section id="equipo" aria-labelledby="equipo-title" className="scroll-mt-24 border-t border-[#d8cfc0] bg-[#f8f5ee]">
                <div className={`${container} py-16 sm:py-24`}>
                    <Reveal>
                        <p className={label}>Equipo base</p>
                        <h2 id="equipo-title" className={`${h2} mt-3 max-w-[24ch] text-[#171713]`}>
                            Dos trayectorias, una lectura común.
                        </h2>
                        <p className="mt-4 max-w-[60ch] text-[1rem] leading-[1.7] text-[#55574f]">
                            Presentamos al equipo desde su rol, formación y aporte disciplinar. Las prestaciones específicas están en la
                            sección de servicios.
                        </p>
                    </Reveal>
                    <ul className="mt-12 grid gap-12 sm:grid-cols-2 lg:gap-10">
                        {DIRECTORS.map((director, index) => (
                            <li key={director.id}>
                                <Reveal delay={index * 0.06}>
                                    <a href={`#${director.id}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f8f5ee]">
                                        <Portrait director={director} sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw" />
                                        <p className="mt-5 text-[0.8125rem] font-semibold text-[#9f5528]">{director.area}</p>
                                        <p className="crc-serif mt-1 text-[1.5rem] font-medium leading-[1.2] text-[#171713] transition-colors group-hover:text-[#9f5528]">
                                            {director.name}
                                        </p>
                                        <p className="mt-1 text-[0.9375rem] font-semibold leading-[1.45] text-[#171713]">{director.role}</p>
                                        <p className="mt-3 text-[0.9375rem] leading-[1.6] text-[#55574f]">{director.summary}</p>
                                        <span className="mt-4 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-[#9f5528] underline decoration-[#d8cfc0] underline-offset-4">
                                            Leer trayectoria
                                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                    </a>
                                </Reveal>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Perfiles completos */}
            <section aria-label="Trayectorias" className="bg-[#fffdf8]">
                <div className={container}>
                    <Profile director={jc}>
                        <div>
                            <h4 className={blockTitle}>Rol editorial y académico</h4>
                            <p className={`${bodyText} mt-4`}>
                                <strong className="font-semibold text-[#171713]">Juan Carlos Rauld es trabajador social formado en la Universidad Tecnológica Metropolitana (UTEM).</strong>{" "}
                                Magíster en Filosofía Política Contemporánea de la
                                Universidad Diego Portales. Actualmente es{" "}
                                <strong className="font-semibold text-[#171713]">
                                    doctorando en Trabajo Social de la Universidad Rovira i Virgili, Facultad de Ciencias Jurídicas y Sociales, España
                                </strong>
                                . Investigador del Centro de Reflexiones Críticas, sus áreas de interés son el trauma psíquico infantil, la
                                filosofía social y política contemporánea, especialmente la biopolítica de la infancia pobre en Chile y la
                                filosofía de la infancia. Posee una doble especialización en salud mental infantil y en filosofía práctica de la
                                niñez, desde el siglo XIX hasta la actualidad. Actualmente, le interesa evaluar metodológicamente la calidad de
                                la intervención clínica especializada con niños, niñas y adolescentes en situaciones de desprotección, así como
                                la fidelidad de implementación de programas y políticas públicas con enfoque basado en evidencia científica.
                            </p>
                        </div>
                        <div>
                            <h4 className={blockTitle}>Trayectoria institucional</h4>
                            <p className={`${bodyText} mt-4`}>
                                Su experiencia cruza programas de infancia, salud mental, protección de derechos y análisis institucional. Ha
                                trabajado en espacios donde la intervención exige lectura técnica, criterio ético, coordinación de equipos y
                                comprensión de los marcos públicos que organizan la protección social.
                            </p>
                        </div>
                        <div>
                            <h4 className={blockTitle}>Actividades e intervenciones públicas</h4>
                            <div className="mt-5 grid gap-6 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start">
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[6px] bg-[#eee8dc] sm:aspect-square">
                                    <Image
                                        src="/images/juan-carlos-rauld-furia-del-libro.jpg"
                                        alt="Juan Carlos Rauld en La Furia del Libro"
                                        fill
                                        sizes="(min-width: 640px) 180px, 100vw"
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Estación Mapocho · Mayo 2026</p>
                                    <h5 className="crc-serif mt-1 text-[1.2rem] font-medium text-[#171713]">Presentación en La Furia del Libro</h5>
                                    <p className="mt-2 text-[0.9375rem] leading-[1.65] text-[#55574f]">
                                        El Centro de Reflexiones Críticas estuvo presente en la versión invernal de La Furia del Libro 2026,
                                        celebrada en el Centro Cultural Estación Mapocho del 28 al 31 de mayo. Juan Carlos Rauld participó en la
                                        presentación y discusión de su obra <em>Tecnócratas de la Infancia</em> (Editorial Hammurabi), abriendo un
                                        debate crítico sobre la biopolítica, la institucionalización de la pobreza y las deudas de la protección
                                        social en Chile.
                                    </p>
                                    <Link href="/publicaciones" className={`${textLink} mt-3`}>
                                        Ver entrevista y video de la actividad
                                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Profile>

                    <Profile
                        director={hugo}
                        aside={
                            <Link href="/instituciones#agenda" className={`${btnPrimary} mt-6`}>
                                Agenda con el equipo
                            </Link>
                        }
                    >
                        <div>
                            <h4 className={blockTitle}>Trayectoria profesional</h4>
                            <div className={`${bodyText} mt-4 space-y-4`}>
                                <p>
                                    Hugo Felipe Hormazábal es Ingeniero Comercial y fundador de{" "}
                                    <a
                                        href="https://www.altiusignite.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-semibold text-[#9f5528] underline decoration-[#d8cfc0] underline-offset-4 hover:text-[#171713]"
                                    >
                                        Altius Ignite
                                    </a>
                                    . En el CRC es socio y dirige el área comercial y de desarrollo institucional: es la persona con quien
                                    conversan colegios, programas de infancia, fundaciones y municipios. Arma el diagnóstico, la propuesta y los
                                    convenios, y se asegura de que lo acordado se implemente y se mida. Desde Altius aporta la capa de datos,
                                    automatización e inteligencia artificial que permite sostener cada intervención con trazabilidad y
                                    seguimiento.
                                </p>
                                <p>
                                    Cuenta con más de 15 años de experiencia articulando operaciones, crecimiento, experiencia de cliente,
                                    inteligencia de negocio y transformación digital en industrias exigentes como contact center/BPO, banca,
                                    fintech, tecnología, retail, servicios, educación y consultoría. Complementa su formación con un Diplomado en
                                    Marketing & Analytics por la Universidad Adolfo Ibáñez (UAI). Ha implementado y escalado operaciones y líneas
                                    de negocio en Chile, Colombia, Argentina, Perú y Bolivia, liderando equipos multiculturales de hasta 700 FTE,
                                    procesos de mejora continua, automatización intensiva, implementación de CRM, reportería ejecutiva,
                                    arquitecturas digitales y soluciones basadas en inteligencia artificial aplicada a productividad, control
                                    operativo y toma de decisiones.
                                </p>
                            </div>
                        </div>
                        <div>
                            <h4 className={blockTitle}>Qué aporta a las instituciones</h4>
                            <dl className="mt-2">
                                {[
                                    { title: "Propuesta y convenio", text: "Diagnóstico, alcance, plazos y precio claros antes de empezar." },
                                    { title: "Medición", text: "Indicadores y reportes para mostrar qué cambió en la institución." },
                                    { title: "Trazabilidad", text: "Registros, protocolos y seguimiento con datos, automatización e IA." },
                                ].map((item) => (
                                    <div key={item.title} className="grid gap-1 border-b border-[#eee8dc] py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
                                        <dt className="font-semibold text-[#171713]">{item.title}</dt>
                                        <dd className="text-[1rem] leading-[1.65] text-[#55574f]">{item.text}</dd>
                                    </div>
                                ))}
                            </dl>
                            <dl className="mt-6 grid gap-6 text-[0.9375rem] leading-[1.6] text-[#55574f] sm:grid-cols-2">
                                <div>
                                    <dt className={labelMuted}>Credenciales</dt>
                                    <dd className="mt-1">AWS Business · Scrum Foundation · Lifelong Learning · Equipos de alto rendimiento</dd>
                                </div>
                                <div>
                                    <dt className={labelMuted}>Herramientas</dt>
                                    <dd className="mt-1">Salesforce · HubSpot · Power BI · APIs · Supabase · Vercel · IA aplicada</dd>
                                </div>
                            </dl>
                        </div>
                    </Profile>
                </div>
            </section>
        </main>
    );
}
