import Link from "next/link";
import { ArrowRight, Brain, Building2, GraduationCap, HeartHandshake, Mail, School, Stethoscope } from "lucide-react";

const serviceRoutes = [
    {
        icon: Stethoscope,
        eyebrow: "Necesito apoyo clínico",
        title: "Atención clínica",
        problem: "Evaluación, intervención y acompañamiento especializado en salud mental, infancia, familia y terapia ocupacional.",
        audience: "Personas, familias, cuidadores y equipos que requieren una orientación profesional clara.",
        outcome: "Un proceso situado, respetuoso y técnicamente fundado.",
        href: "/servicios/clinica",
    },
    {
        icon: Building2,
        eyebrow: "Soy una institución",
        title: "Consultoría institucional",
        problem: "Diseño, diagnóstico y mejora de modelos de intervención, programas sociales, gestión y toma de decisiones.",
        audience: "Organizaciones públicas, privadas, fundaciones, programas y equipos directivos.",
        outcome: "Criterios, procesos y herramientas para operar con mayor coherencia y trazabilidad.",
        href: "/servicios/consultoria",
    },
    {
        icon: School,
        eyebrow: "Soy un colegio",
        title: "Bienestar escolar",
        problem: "Soporte interdisciplinario para convivencia, salud mental, riesgo suicida, protocolos y cumplimiento escolar.",
        audience: "Colegios y comunidades educativas que necesitan ordenar su gestión preventiva.",
        outcome: "Un marco de acompañamiento para que el colegio pueda enfocarse en educar.",
        href: "/servicios/bienestar-escolar",
    },
    {
        icon: GraduationCap,
        eyebrow: "Quiero formar equipos",
        title: "Formación y supervisión",
        problem: "Capacitaciones, charlas, supervisión clínica y espacios de actualización para equipos profesionales.",
        audience: "Profesionales, instituciones, comunidades educativas y equipos de salud o intervención social.",
        outcome: "Aprendizaje aplicable, reflexión técnica y fortalecimiento de buenas prácticas.",
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
                    <div className="grid gap-4 lg:grid-cols-4">
                        {serviceRoutes.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <article key={service.title} className="group flex h-full flex-col rounded-[8px] border border-[#ded5c7] bg-[#fffdf8] shadow-sm transition hover:-translate-y-1 hover:border-[#bd6f3c]/40 hover:shadow-md">
                                    <div className="border-b border-[#eee8dc] bg-[#171713] p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-[6px] bg-[#fffdf8] text-[#bd6f3c] shadow-sm">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <span className="font-serif text-5xl font-bold leading-none text-white/12">
                                                0{index + 1}
                                            </span>
                                        </div>
                                        <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.18em] text-[#d3976d]">{service.eyebrow}</p>
                                        <h2 className="mt-3 text-2xl font-bold leading-tight text-white font-serif">{service.title}</h2>
                                    </div>
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="space-y-4 text-sm leading-7 text-[#70695f]">
                                            <p><strong className="text-[#3f423a]">Qué resuelve:</strong> {service.problem}</p>
                                            <p><strong className="text-[#3f423a]">Para quién:</strong> {service.audience}</p>
                                            <p><strong className="text-[#3f423a]">Qué obtienes:</strong> {service.outcome}</p>
                                        </div>
                                        <div className="mt-auto flex flex-col gap-3 pt-7">
                                            <Link href={service.href} className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#171713] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#34362f]">
                                                Ver detalle
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                            <Link href="/contacto" className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-[#ded5c7] bg-[#fffdf8] px-5 py-3 text-sm font-bold text-[#171713] transition hover:border-[#bd6f3c]/50">
                                                <Mail className="h-4 w-4" />
                                                Solicitar orientación
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-[#f8f5ee] py-12 sm:py-16">
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
