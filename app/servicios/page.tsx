import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, ChevronDown, GraduationCap, School, ShieldCheck, Stethoscope } from "lucide-react";

export const metadata: Metadata = {
    title: "Servicios | Atención Clínica, Consultoría y Compliance Escolar",
    description:
        "Conoce los servicios del Centro de Reflexiones Críticas: atención clínica en salud mental e infancia, consultoría institucional, bienestar y compliance escolar, y formación para equipos.",
    openGraph: {
        title: "Servicios CRC: clínica, consultoría, bienestar escolar y formación",
        description:
            "Atención clínica, consultoría institucional, compliance escolar y formación profesional con enfoque técnico y humano.",
    },
};

const serviceRoutes = [
    {
        icon: Stethoscope,
        eyebrow: "Personas y familias",
        title: "Atención clínica",
        promise: "Apoyo profesional para ordenar lo que está pasando y definir un proceso de cuidado.",
        focus: "Salud mental, infancia, familia y terapia ocupacional.",
        details: [
            ["Qué resuelve", "Evaluación, intervención y acompañamiento especializado en salud mental, infancia, familia y terapia ocupacional."],
            ["Para quién", "Personas, familias, cuidadores y equipos que requieren una orientación profesional clara."],
            ["Qué obtienes", "Un proceso situado, respetuoso y técnicamente fundado."],
        ],
        modality: "Presencial · Online · Domiciliario",
        href: "/servicios/clinica",
    },
    {
        icon: Building2,
        eyebrow: "Instituciones",
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
        icon: ShieldCheck,
        eyebrow: "Colegios",
        title: "Compliance escolar",
        promise: "Revisión de brechas y protocolos para responder con claridad y respaldo técnico.",
        focus: "Ley 21.809, convivencia escolar y exposición institucional.",
        details: [
            ["Qué resuelve", "Auditoría de protocolos, Ley 21.809, convivencia escolar, trazabilidad y exposición civil o administrativa."],
            ["Para quién", "Sostenedores, equipos directivos y encargados de convivencia que necesitan blindar su respuesta institucional."],
            ["Qué obtienes", "Brechas claras, equipos entrenados y una ruta de cumplimiento verificable."],
        ],
        modality: "Presencial · Online",
        href: "/servicios/compliance-escolar",
    },
    {
        icon: School,
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
        icon: GraduationCap,
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

export default function ServicesHub() {
    return (
        <main className="bg-[#fffdf8] text-[#171713]">
            <section className="relative overflow-hidden bg-[#171713] py-20 sm:py-28">
                <div className="absolute inset-0 opacity-12">
                    <img src="/images/consulting_hero.png" alt="" className="h-full w-full object-cover mix-blend-luminosity" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#171713]/80 via-[#171713]/92 to-[#171713]" />
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl">
                        <span className="inline-flex items-center rounded-[5px] border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d8d0c4]">
                            Servicios CRC
                        </span>
                        <h1 className="mt-7 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl font-serif">
                            Elige el tipo de apoyo que necesitas.
                        </h1>
                        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#d8d0c4]">
                            Ordenamos nuestra oferta en rutas simples para que no tengas que leer un catálogo completo. Cada servicio tiene su propia página con enfoque, alcance y próximos pasos.
                        </p>
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 max-w-3xl">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Rutas de atención</span>
                        <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#171713] sm:text-4xl">
                            Elige una ruta. Nosotros ordenamos el siguiente paso.
                        </h2>
                        <p className="mt-3 text-base leading-7 text-[#70695f]">
                            Cada servicio parte con una orientación inicial para entender la necesidad y recomendar el camino adecuado.
                        </p>
                    </div>

                    <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {serviceRoutes.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <article key={service.title} className="group flex h-full min-h-[390px] flex-col rounded-[8px] border border-[#ded5c7] bg-[#fffdf8] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#bd6f3c]/45 hover:shadow-[0_18px_42px_rgba(31,27,22,0.09)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                                    <div className="flex items-start justify-between gap-5">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#171713] text-[#d3976d] transition duration-300 group-hover:bg-[#bd6f3c] group-hover:text-white">
                                                <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
                                            </span>
                                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#bd6f3c]">{service.eyebrow}</p>
                                        </div>
                                        <span className="font-serif text-4xl font-bold leading-none text-[#171713]/10">
                                            0{index + 1}
                                        </span>
                                    </div>

                                    <h3 className="mt-7 font-serif text-2xl font-bold leading-tight text-[#171713] sm:text-[1.7rem]">
                                        {service.title}
                                    </h3>
                                    <p className="mt-4 text-base leading-7 text-[#625c52]">
                                        {service.promise}
                                    </p>

                                    <div className="mt-5 space-y-3 border-t border-[#eee8dc] pt-5 text-sm leading-6 text-[#70695f]">
                                        <p><strong className="font-semibold text-[#3f423a]">Enfoque:</strong> {service.focus}</p>
                                        <p><strong className="font-semibold text-[#3f423a]">Modalidad:</strong> {service.modality}</p>
                                    </div>

                                    <details className="group/details mt-4 rounded-[7px] border border-[#eee8dc] bg-[#f8f5ee]/55 px-4 py-3 text-sm text-[#70695f] open:bg-[#fffdf8]">
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-[#3f423a] marker:hidden">
                                            Ver alcance
                                            <ChevronDown className="h-4 w-4 shrink-0 text-[#bd6f3c] transition-transform duration-200 group-open/details:rotate-180" />
                                        </summary>
                                        <div className="mt-3 space-y-3 border-t border-[#eee8dc] pt-3 leading-6">
                                            {service.details.map(([label, text]) => (
                                                <p key={label}>
                                                    <strong className="font-semibold text-[#3f423a]">{label}:</strong> {text}
                                                </p>
                                            ))}
                                        </div>
                                    </details>

                                    <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
                                        <Link href={`/contacto?servicio=${service.href.split("/").pop()}`} className="group/cta inline-flex flex-1 items-center justify-center gap-2 rounded-[7px] bg-[#171713] px-5 py-3 text-sm font-bold text-white transition duration-200 hover:bg-[#34362f]">
                                            Agenda de atención
                                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                                        </Link>
                                        <Link href={service.href} className="inline-flex items-center justify-center gap-2 rounded-[7px] border border-[#ded5c7] bg-[#fffdf8] px-5 py-3 text-sm font-bold text-[#171713] transition hover:border-[#bd6f3c]/50">
                                            Ver detalle
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-[#f8f5ee] border-b border-[#eee8dc] py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 max-w-3xl">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Nuestro Equipo</span>
                        <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#171713] sm:text-4xl">
                            Staff Profesional
                        </h2>
                        <p className="mt-3 text-base leading-7 text-[#70695f]">
                            Conoce al equipo de especialistas detrás de nuestras intervenciones. Profesionales con trayectoria clínica, institucional y corporativa.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                name: "Juan Carlos Rauld",
                                role: "Director CRC & Consultor",
                                desc: "Salud mental infantil y diseño de programas.",
                                img: "/images/juan_carlos_real_white.png",
                                href: "/conocenos#equipo"
                            },
                            {
                                name: "Rocío Solar",
                                role: "Terapeuta Ocupacional · Cofundadora",
                                desc: "Salud mental infanto-juvenil y regulación.",
                                img: "/images/rocio_solar_real_white.png",
                                href: "/conocenos#equipo"
                            },
                            {
                                name: "Hugo Felipe Hormazábal",
                                role: "Ingeniero Comercial",
                                desc: "Estrategia tecnológica y servicios.",
                                img: "/images/hugo-hormazabal-crc-2026-large.png",
                                href: "/conocenos#equipo"
                            },
                            {
                                name: "Fernanda Gumucio Dobbs",
                                role: "Psicóloga Clínica Infanto-Juvenil",
                                desc: "Terapia Basada en Mentalización.",
                                img: "/images/fernanda-gumucio.jpg",
                                href: "https://subjetivamente.cl"
                            }
                        ].map((person) => (
                            <Link key={person.name} href={person.href} className="group flex flex-col rounded-[8px] border border-[#ded5c7] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#bd6f3c]/50">
                                <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-[6px] bg-[#f8f5ee]">
                                    <img
                                        src={person.img}
                                        alt={person.name}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <h3 className="font-serif text-lg font-bold text-[#171713]">{person.name}</h3>
                                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#bd6f3c]">{person.role}</p>
                                <p className="mt-2 text-xs leading-5 text-[#70695f]">{person.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[8px] border border-[#ead8c7] bg-[#fffdf8] p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
                        <div className="max-w-3xl">
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Orientación inicial</span>
                            <h2 className="mt-3 text-2xl font-bold leading-tight text-[#171713] sm:text-3xl font-serif">
                                Si no sabes qué servicio corresponde, partimos por ordenar la necesidad.
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-[#70695f]">
                                Una primera conversación permite distinguir si el caso requiere atención clínica, asesoría institucional, soporte escolar o formación para equipos.
                            </p>
                        </div>
                        <Link href="/contacto" className="mt-5 inline-flex shrink-0 items-center justify-center gap-2 rounded-[5px] bg-[#171713] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#34362f] sm:mt-0">
                            Solicitar orientación
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
