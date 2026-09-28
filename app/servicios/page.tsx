import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StaffSection from "@/components/StaffSection";
import { pageMetadata } from "@/lib/seo";
import { ClosingBand, EngagementIndex, SectionHead } from "./_components/Blocks";
import { INSTITUTIONAL_ENGAGEMENTS, VALUE_NOTE } from "./_components/engagements";
import { Reveal } from "./_components/Reveal";
import { container, h1, label, lead, textLink } from "./_components/ui";

export const metadata: Metadata = pageMetadata({
    title: "Servicios | Acompañamiento Familiar, Clínica y Consultoría",
    description:
        "Conoce los servicios del Centro de Reflexiones Críticas: acompañamiento para familias, atención clínica en salud mental e infancia, consultoría institucional, bienestar y compliance escolar, y formación para equipos.",
    path: "/servicios",
    ogTitle: "Servicios CRC: familias, clínica, consultoría y formación",
    ogDescription: "Acompañamiento familiar, atención clínica, consultoría institucional, compliance escolar y formación profesional con enfoque técnico y humano.",
});

type Route = {
    eyebrow: string;
    title: string;
    promise: string;
    focus: string;
    details: [string, string][];
    modality: string;
    href: string;
};

// Servicios que compra una institución: su siguiente paso es la conversación
// con Hugo, no pedir una hora clínica.
const INSTITUTIONAL = new Set([
    "/servicios/consultoria",
    "/servicios/compliance-escolar",
    "/servicios/bienestar-escolar",
    "/servicios/formacion",
]);

const personalRoutes: Route[] = [
    {
        eyebrow: "Familias",
        title: "Acompañamiento familiar",
        promise: "El primer paso cuando algo en casa no está bien y todavía no sabes a quién preguntar.",
        focus: "Conflictos familiares, contención en crisis e informe social de discapacidad.",
        details: [
            ["Qué resuelve", "Orientación cuando la familia atraviesa conflictos, crisis emocionales o necesita respaldo social para trámites de discapacidad."],
            ["Para quién", "Familias y cuidadores preocupados por niños, niñas, adolescentes o jóvenes."],
            ["Qué obtienes", "Entender qué está pasando y salir con un siguiente paso concreto."],
        ],
        modality: "Online · Presencial según la situación",
        href: "/servicios/acompanamiento-familiar",
    },
    {
        eyebrow: "Procesos clínicos",
        title: "Atención clínica",
        promise: "Evaluación e intervención sostenida cuando el caso requiere un equipo y respaldo documental.",
        focus: "Salud mental, terapia ocupacional, adicciones e informes técnicos.",
        details: [
            ["Qué resuelve", "Evaluación de competencias parentales, informes periciales y socioocupacionales, terapia ocupacional y tratamiento en salud mental."],
            ["Para quién", "Personas y familias que ya necesitan un proceso clínico o un documento con validez técnica."],
            ["Qué obtienes", "Un proceso situado, respetuoso y técnicamente fundado."],
        ],
        modality: "Presencial · Online · Domiciliario",
        href: "/servicios/clinica",
    },
];

const institutionalRoutes: Route[] = [
    {
        eyebrow: "Colegios",
        title: "Compliance escolar",
        promise: "Revisión de brechas y protocolos para responder con claridad y respaldo técnico.",
        focus: "Ley 21.809, convivencia escolar y exposición institucional.",
        details: [
            ["Qué resuelve", "Auditoría de protocolos, Ley 21.809, convivencia escolar, trazabilidad y exposición civil o administrativa."],
            ["Para quién", "Sostenedores, equipos directivos y encargados de convivencia que necesitan responder a tiempo y poder demostrar cómo respondieron."],
            ["Qué obtienes", "Brechas claras, equipos entrenados y una ruta de cumplimiento verificable."],
        ],
        modality: "Presencial · Online",
        href: "/servicios/compliance-escolar",
    },
    {
        eyebrow: "Comunidades educativas",
        title: "Bienestar escolar",
        promise: "Acompañamiento para prevenir, contener y ordenar situaciones complejas dentro del colegio.",
        focus: "Convivencia, salud mental, riesgo suicida y protocolos.",
        details: [
            ["Qué resuelve", "Soporte interdisciplinario para convivencia, salud mental, riesgo suicida, protocolos y cumplimiento escolar."],
            ["Para quién", "Colegios y comunidades educativas que necesitan ordenar su gestión preventiva."],
            ["Qué obtienes", "Un marco de acompañamiento para que el colegio pueda enfocarse en educar."],
        ],
        modality: "Presencial · Online",
        href: "/servicios/bienestar-escolar",
    },
    {
        eyebrow: "Programas y fundaciones",
        title: "Consultoría institucional",
        promise: "Diagnóstico y mejora para tomar mejores decisiones con equipos, programas y procesos.",
        focus: "Modelos de intervención, gestión y trazabilidad.",
        details: [
            ["Qué resuelve", "Diseño, diagnóstico y mejora de modelos de intervención, programas sociales, gestión y toma de decisiones."],
            ["Para quién", "Organizaciones públicas, privadas, fundaciones, programas y equipos directivos."],
            ["Qué obtienes", "Criterios, procesos y herramientas para operar con mayor coherencia y trazabilidad."],
        ],
        modality: "Presencial · Online",
        href: "/servicios/consultoria",
    },
    {
        eyebrow: "Equipos profesionales",
        title: "Formación y supervisión",
        promise: "Capacitaciones y supervisión para fortalecer criterio, práctica y trabajo de equipo.",
        focus: "Charlas, actualización técnica y supervisión clínica.",
        details: [
            ["Qué resuelve", "Capacitaciones, charlas, supervisión clínica y espacios de actualización para equipos profesionales."],
            ["Para quién", "Profesionales, instituciones, comunidades educativas y equipos de salud o intervención social."],
            ["Qué obtienes", "Aprendizaje aplicable, reflexión técnica y fortalecimiento de buenas prácticas."],
        ],
        modality: "Presencial · Online",
        href: "/servicios/formacion",
    },
];

function RouteList({ routes }: { routes: Route[] }) {
    return (
        <ol className="border-b border-[#d8cfc0]">
            {routes.map((service) => {
                const institutional = INSTITUTIONAL.has(service.href);
                return (
                    <li key={service.href} className="border-t border-[#d8cfc0]">
                        <Reveal className="grid gap-5 py-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)_minmax(0,0.7fr)] lg:gap-10">
                            <div>
                                <p className={label}>{service.eyebrow}</p>
                                <h3 className="crc-serif mt-1.5 text-[1.5rem] font-medium leading-[1.2] text-[#171713]">
                                    <Link href={service.href} className="transition-colors hover:text-[#9f5528]">
                                        {service.title}
                                    </Link>
                                </h3>
                            </div>
                            <div>
                                <p className="text-[1rem] leading-[1.7] text-[#171713]">{service.promise}</p>
                                <p className="mt-2 text-[0.9375rem] leading-[1.6] text-[#55574f]">{service.focus}</p>
                                <details className="group mt-3 text-[0.9375rem] text-[#55574f]">
                                    <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 font-semibold text-[#9f5528] underline decoration-[#d8cfc0] underline-offset-4 marker:hidden hover:text-[#171713]">
                                        Ver alcance
                                    </summary>
                                    <dl className="mt-3 border-t border-[#eee8dc]">
                                        {service.details.map(([term, text]) => (
                                            <div key={term} className="grid gap-1 border-b border-[#eee8dc] py-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
                                                <dt className="font-semibold text-[#171713]">{term}</dt>
                                                <dd className="leading-[1.6]">{text}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </details>
                            </div>
                            <div className="flex flex-col gap-3 lg:items-start">
                                <p className="text-[0.875rem] text-[#6f675d]">{service.modality}</p>
                                <Link href={service.href} className={textLink}>
                                    Ver el servicio
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                                <Link
                                    href={institutional ? "/instituciones#agenda" : `/contacto?servicio=${service.href.split("/").pop()}`}
                                    className="text-[0.9375rem] font-semibold text-[#55574f] transition-colors hover:text-[#9f5528]"
                                >
                                    {institutional ? "Agendar con Hugo" : "Solicitar hora"}
                                </Link>
                            </div>
                        </Reveal>
                    </li>
                );
            })}
        </ol>
    );
}

export default function ServicesHub() {
    return (
        <main className="bg-[#fffdf8] text-[#171713]">
            <section aria-labelledby="servicios-title" className="border-b border-[#d8cfc0] bg-[#f8f5ee]">
                <div className={`${container} grid gap-10 pb-14 pt-14 sm:pb-20 sm:pt-20 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:items-end lg:gap-16`}>
                    <div>
                        <p className={label}>Servicios del CRC</p>
                        <h1 id="servicios-title" className={`${h1} mt-4 max-w-[20ch] text-[#171713]`}>
                            Elige el tipo de apoyo que necesitas
                        </h1>
                        <p className={`${lead} mt-6 max-w-[58ch]`}>
                            Ordenamos la oferta en rutas simples para que no tengas que leer un catálogo completo. Cada servicio tiene su
                            propia página con enfoque, alcance y próximos pasos.
                        </p>
                    </div>
                    <nav aria-label="Rutas de servicio" className="border-t border-[#d8cfc0] lg:border-l lg:border-t-0 lg:pl-8">
                        <a href="#personas" className="group flex items-center justify-between gap-4 border-b border-[#d8cfc0] py-4">
                            <span>
                                <span className="block text-[0.8125rem] font-semibold text-[#6f675d]">Para personas y familias</span>
                                <span className="crc-serif block text-[1.2rem] font-medium text-[#171713] group-hover:text-[#9f5528]">Familia y clínica</span>
                            </span>
                            <ArrowRight className="h-4 w-4 text-[#9f5528]" aria-hidden="true" />
                        </a>
                        <a href="#instituciones" className="group flex items-center justify-between gap-4 py-4">
                            <span>
                                <span className="block text-[0.8125rem] font-semibold text-[#6f675d]">Para colegios, programas y fundaciones</span>
                                <span className="crc-serif block text-[1.2rem] font-medium text-[#171713] group-hover:text-[#9f5528]">Instituciones</span>
                            </span>
                            <ArrowRight className="h-4 w-4 text-[#9f5528]" aria-hidden="true" />
                        </a>
                    </nav>
                </div>
            </section>

            <section id="personas" aria-labelledby="personas-title" className="scroll-mt-24 bg-[#fffdf8]">
                <div className={`${container} py-16 sm:py-24`}>
                    <Reveal>
                        <SectionHead eyebrow="Personas y familias" title="Cuando algo en casa no está bien" id="personas-title">
                            <p>Cada servicio parte con una orientación inicial para entender la necesidad y recomendar el camino adecuado.</p>
                        </SectionHead>
                    </Reveal>
                    <div className="mt-10">
                        <RouteList routes={personalRoutes} />
                    </div>
                </div>
            </section>

            <section id="instituciones" aria-labelledby="instituciones-title" className="scroll-mt-24 border-t border-[#d8cfc0] bg-[#f8f5ee]">
                <div className={`${container} py-16 sm:py-24`}>
                    <Reveal>
                        <SectionHead eyebrow="Instituciones" title="Colegios, programas de protección, fundaciones y municipios" id="instituciones-title">
                            <p>
                                El siguiente paso es una conversación de 20 minutos con Hugo Felipe Hormazábal, que coordina el diagnóstico, la
                                propuesta y el convenio.
                            </p>
                        </SectionHead>
                    </Reveal>
                    <div className="mt-10">
                        <RouteList routes={institutionalRoutes} />
                    </div>

                    <Reveal className="mt-16">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <h3 className="crc-serif text-[1.5rem] font-medium leading-[1.2] text-[#171713]">Compromisos institucionales</h3>
                            <p className="text-[0.9375rem] font-semibold text-[#9f5528]">{VALUE_NOTE}</p>
                        </div>
                        <div className="mt-6">
                            <EngagementIndex engagements={INSTITUTIONAL_ENGAGEMENTS} />
                        </div>
                    </Reveal>
                </div>
            </section>

            <StaffSection />

            <ClosingBand
                eyebrow="Orientación inicial"
                title="Si no sabes qué servicio corresponde, partimos por ordenar la necesidad."
                primary={{ href: "/contacto", label: "Solicitar orientación" }}
                secondary={{ href: "/instituciones#agenda", label: "Soy una institución" }}
            >
                <p>
                    Una primera conversación permite distinguir si el caso requiere atención clínica, asesoría institucional, soporte
                    escolar o formación para equipos.
                </p>
            </ClosingBand>
        </main>
    );
}
