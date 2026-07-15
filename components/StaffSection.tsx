"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const teamMembers = [
    {
        name: "Juan Carlos Rauld",
        role: "Director CRC & Consultor en Ciencias Sociales",
        shortRole: "Director CRC & Consultor",
        desc: "Salud mental infantil y diseño de programas.",
        img: "/images/juan_carlos_real_white.png",
        degree: "Doctorando en Trabajo Social · Universidad Rovira i Virgili, España",
        bio: [
            "Juan Carlos Rauld es trabajador social formado en la Universidad Tecnológica Metropolitana (UTEM). Magíster en Pensamiento Contemporáneo en Filosofía y Pensamiento Político del Instituto de Filosofía de la Universidad Diego Portales. Actualmente es doctorando en Trabajo Social de la Universidad Rovira i Virgili, Facultad de Ciencias Jurídicas y Sociales, España.",
            "Investigador del Centro de Reflexiones Críticas, sus áreas de interés son el trauma psíquico infantil, la filosofía social y política contemporánea, especialmente la biopolítica de la infancia pobre en Chile y la filosofía de la infancia.",
            "Posee una doble especialización en salud mental infantil y en filosofía práctica de la niñez, desde el siglo XIX hasta la actualidad. Actualmente, le interesa evaluar metodológicamente la calidad de la intervención clínica especializada con niños, niñas y adolescentes en situaciones de desprotección, así como la fidelidad de implementación de programas y políticas públicas con enfoque basado en evidencia científica.",
        ],
        sections: [
            {
                title: "Trayectoria Institucional",
                text: "Su experiencia cruza programas de infancia, salud mental, protección de derechos y análisis institucional. Ha trabajado en espacios donde la intervención exige lectura técnica, criterio ético, coordinación de equipos y comprensión de los marcos públicos que organizan la protección social.",
            },
        ],
        links: [
            { label: "Academia.edu", href: "https://uc-cl.academia.edu/JUANCARLOSRAULDFARÍAS" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/juan-carlos-rauld-farias-a64710a4/" },
        ],
    },
    {
        name: "Rocío Solar",
        role: "Terapeuta Ocupacional · Académica · Cofundadora CRC",
        shortRole: "Terapeuta Ocupacional · Cofundadora",
        desc: "Salud mental infanto-juvenil y regulación.",
        img: "/images/rocio_solar_real_white.png",
        degree: "Magíster (c) en Ocupación y Terapia Ocupacional · Facultad de Medicina, Universidad de Chile",
        bio: [
            "Rocío Solar es terapeuta ocupacional, académica y cofundadora del CRC, con 9 años de experiencia clínica y psicosocial en salud mental infanto-juvenil. Su trayectoria se ha desarrollado principalmente en evaluación e intervención terapéutica con niños, niñas, adolescentes y sus familias, abordando procesos asociados a regulación emocional, participación ocupacional, crisis en salud mental y acompañamiento en contextos de alta complejidad.",
            "Ha trabajado en dispositivos de salud pública, atención clínica particular y programas especializados de salud mental, desarrollando procesos terapéuticos individuales, familiares y grupales desde un enfoque integral y centrado en la singularidad de cada persona.",
        ],
        sections: [
            {
                title: "Formación y Enfoque",
                text: "Su enfoque clínico integra terapia ocupacional, salud mental y perspectivas relacionales, comprendiendo el bienestar y la participación ocupacional como procesos profundamente vinculados a las experiencias cotidianas, los vínculos y los contextos de vida. Cuenta con formación en salud mental y psiquiatría comunitaria, género e intervención psicosocial, reducción de daños y prácticas basadas en evidencia.",
            },
        ],
        links: [
            { label: "LinkedIn", href: "https://www.linkedin.com/in/rocío-solar-guerra-168693138/" },
        ],
    },
    {
        name: "Hugo Felipe Hormazábal",
        role: "Estrategia Tecnológica, Ingeniería de Servicios e Inteligencia Aplicada",
        shortRole: "Ingeniero Comercial",
        desc: "Estrategia tecnológica y servicios.",
        img: "/images/hugo-hormazabal-crc-2026-large.png",
        degree: "Ingeniero Comercial · Diplomado en Marketing & Analytics, UAI",
        bio: [
            "Hugo Felipe Hormazábal es Ingeniero Comercial y fundador de Altius Ignite, empresa de transformación digital desde la cual desarrolla soluciones de automatización, inteligencia artificial, datos y arquitectura tecnológica aplicada.",
            "En el CRC lidera la visión tecnológica y la ingeniería de servicios: traduce necesidades clínicas, sociales e institucionales en sistemas, datos, flujos y herramientas digitales que permiten sostener intervenciones con mayor trazabilidad, continuidad y capacidad de aprendizaje.",
            "Cuenta con más de 15 años de experiencia articulando operaciones, crecimiento, experiencia de cliente, inteligencia de negocio y transformación digital en industrias exigentes como contact center/BPO, banca, fintech, tecnología, retail, servicios, educación y consultoría.",
        ],
        sections: [
            {
                title: "Capacidades Aplicadas",
                text: "Ingeniería de servicios (procesos, flujos, seguimiento), inteligencia aplicada (datos, indicadores, reporting ejecutivo), automatización e IA (herramientas digitales para productividad, control y decisión). Stack: Salesforce, HubSpot, Power BI, APIs, Supabase, Vercel, IA aplicada.",
            },
        ],
        links: [
            { label: "LinkedIn", href: "https://www.linkedin.com/in/hugo-felipe-hormazabal-561005332/" },
            { label: "Altius Ignite", href: "https://www.altiusignite.com" },
        ],
    },
    {
        name: "Fernanda Gumucio Dobbs",
        role: "Psicóloga Clínica Infanto-Juvenil",
        shortRole: "Psicóloga Clínica Infanto-Juvenil",
        desc: "Terapia Basada en Mentalización.",
        img: "/images/fernanda-gumucio.jpg",
        degree: "Magíster en Psicología Clínica Infanto-Juvenil · Universidad de Chile",
        bio: [
            "Fernanda Gumucio es psicóloga clínica, Magíster en Psicología Clínica Infanto-Juvenil por la Universidad de Chile. Su trayectoria se ha desarrollado en los ámbitos clínicos, educacionales e institucionales, combinando la atención psicoterapéutica, la evaluación psicológica, la supervisión clínica y el desarrollo de programas orientados a la salud mental.",
            "Ha trabajado con niños, adolescentes, adultos y familias en diversos contextos asistenciales, incluyendo programas especializados de protección de niños, niñas y adolescentes, intervención con víctimas de maltrato y abuso sexual, acompañamiento a familias en contextos de alta vulnerabilidad psicosocial y coordinación con redes de salud, educación y protección.",
        ],
        sections: [
            {
                title: "Formación y Enfoque Clínico",
                text: "Su práctica clínica se orienta a comprender el funcionamiento psicológico de cada persona en el contexto de su historia, sus vínculos y las circunstancias que dan forma a su experiencia. Integra aportes de distintos modelos contemporáneos de psicoterapia, incluyendo la Terapia Basada en Mentalización, seleccionando las estrategias de intervención de acuerdo con la formulación clínica, la evidencia disponible y las características de cada caso.",
            },
            {
                title: "Gestión y Liderazgo Institucional",
                text: "En su rol de gestión clínica lidera el desarrollo de procesos clínicos, la coordinación de equipos profesionales y la implementación de estándares de calidad en la atención psicológica. Asimismo, realiza supervisión clínica a psicólogos y equipos, acompañando procesos de formulación clínica, análisis de casos y toma de decisiones en situaciones de alta complejidad.",
            },
        ],
        links: [],
    },
];

export default function StaffSection() {
    const [selectedPerson, setSelectedPerson] = useState<typeof teamMembers[0] | null>(null);

    return (
        <>
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
                        {teamMembers.map((person) => (
                            <button
                                key={person.name}
                                onClick={() => setSelectedPerson(person)}
                                className="group flex flex-col rounded-[8px] border border-[#ded5c7] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#bd6f3c]/50 hover:shadow-[0_18px_42px_rgba(31,27,22,0.09)] text-left cursor-pointer"
                            >
                                <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-[6px] bg-white">
                                    <Image
                                        src={person.img}
                                        alt={person.name}
                                        fill
                                        className="object-contain object-bottom transition duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <h3 className="font-serif text-lg font-bold text-[#171713]">{person.name}</h3>
                                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#bd6f3c]">{person.shortRole}</p>
                                <p className="mt-2 text-xs leading-5 text-[#70695f]">{person.desc}</p>
                                <span className="mt-auto pt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-[#bd6f3c] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    Ver perfil →
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {selectedPerson && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6"
                        onClick={() => setSelectedPerson(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[12px] border border-[#eee8dc] bg-[#fffdf8] shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setSelectedPerson(null)}
                                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#171713]/5 text-[#70695f] transition hover:bg-[#171713]/10 hover:text-[#171713]"
                                aria-label="Cerrar"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Header */}
                            <div className="flex flex-col items-center gap-6 border-b border-[#eee8dc] bg-gradient-to-b from-[#f8f5ee] to-[#fffdf8] px-6 pb-8 pt-10 sm:flex-row sm:items-start sm:px-10">
                                <div className="relative h-40 w-32 shrink-0 overflow-hidden rounded-[8px] bg-white shadow-md ring-1 ring-[#eee8dc] sm:h-48 sm:w-36">
                                    <Image
                                        src={selectedPerson.img}
                                        alt={selectedPerson.name}
                                        fill
                                        className="object-contain object-bottom"
                                    />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="font-serif text-2xl font-bold text-[#171713] sm:text-3xl">
                                        {selectedPerson.name}
                                    </h3>
                                    <p className="mt-2 text-sm font-bold uppercase tracking-[0.1em] text-[#bd6f3c]">
                                        {selectedPerson.role}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-[#70695f]">
                                        {selectedPerson.degree}
                                    </p>
                                    {selectedPerson.links && selectedPerson.links.length > 0 && (
                                        <div className="mt-4 flex flex-wrap items-center gap-2">
                                            {selectedPerson.links.map((link) => (
                                                <a
                                                    key={link.label}
                                                    href={link.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-[#ded5c7] bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#70695f] shadow-sm transition hover:border-[#bd6f3c]/50 hover:text-[#bd6f3c]"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    {link.label}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Body */}
                            <div className="space-y-6 px-6 py-8 sm:px-10">
                                {/* Bio paragraphs */}
                                <div>
                                    {selectedPerson.bio.map((paragraph, i) => (
                                        <p key={i} className={`text-[#55574f] leading-relaxed ${i > 0 ? "mt-4" : ""}`}>
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                {/* Additional sections */}
                                {selectedPerson.sections.map((section) => (
                                    <div key={section.title} className="border-t border-[#eee8dc] pt-5">
                                        <h4 className="mb-3 text-lg font-semibold text-[#171713]">
                                            {section.title}
                                        </h4>
                                        <p className="text-[#55574f] leading-relaxed">
                                            {section.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
