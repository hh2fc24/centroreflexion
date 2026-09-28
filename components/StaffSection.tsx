"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const teamMembers = [
    {
        name: "Juan Carlos Rauld",
        role: "Director del CRC · Consultor en ciencias sociales",
        shortRole: "Director del CRC",
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
                title: "Trayectoria institucional",
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
        role: "Cofundadora · Directora Clínica",
        shortRole: "Cofundadora · Directora Clínica",
        desc: "Salud mental infanto-juvenil y regulación.",
        img: "/images/rocio_solar_real_white.png",
        degree: "Magíster (c) en Ocupación y Terapia Ocupacional · Facultad de Medicina, Universidad de Chile",
        bio: [
            "Rocío Solar es terapeuta ocupacional, académica, cofundadora y Directora Clínica del CRC, con 9 años de experiencia clínica y psicosocial en salud mental infanto-juvenil. Su trayectoria se ha desarrollado principalmente en evaluación e intervención terapéutica con niños, niñas, adolescentes y sus familias, abordando procesos asociados a regulación emocional, participación ocupacional, crisis en salud mental y acompañamiento en contextos de alta complejidad.",
            "Ha trabajado en dispositivos de salud pública, atención clínica particular y programas especializados de salud mental, desarrollando procesos terapéuticos individuales, familiares y grupales desde un enfoque integral y centrado en la singularidad de cada persona.",
        ],
        sections: [
            {
                title: "Formación y enfoque",
                text: "Su enfoque clínico integra terapia ocupacional, salud mental y perspectivas relacionales, comprendiendo el bienestar y la participación ocupacional como procesos profundamente vinculados a las experiencias cotidianas, los vínculos y los contextos de vida. Cuenta con formación en salud mental y psiquiatría comunitaria, género e intervención psicosocial, reducción de daños y prácticas basadas en evidencia.",
            },
        ],
        links: [
            { label: "LinkedIn", href: "https://www.linkedin.com/in/rocío-solar-guerra-168693138/" },
        ],
    },
    {
        name: "Hugo Felipe Hormazábal",
        role: "Socio · Director Comercial y de Desarrollo Institucional",
        shortRole: "Socio · Director Comercial",
        desc: "Instituciones, convenios y medición.",
        img: "/images/hugo-hormazabal-crc-2026-large.png",
        degree: "Ingeniero Comercial · Diplomado en Marketing & Analytics, UAI",
        bio: [
            "Hugo Felipe Hormazábal es Ingeniero Comercial y fundador de Altius Ignite, empresa de transformación digital desde la cual desarrolla soluciones de automatización, inteligencia artificial, datos y arquitectura tecnológica aplicada.",
            "En el CRC es socio y dirige el área comercial y de desarrollo institucional: es con quien conversan colegios, programas, fundaciones y municipios. Arma el diagnóstico, la propuesta y los convenios, y se asegura de que lo acordado se implemente y se mida.",
            "Cuenta con más de 15 años de experiencia articulando operaciones, crecimiento, experiencia de cliente, inteligencia de negocio y transformación digital en industrias exigentes como contact center/BPO, banca, fintech, tecnología, retail, servicios, educación y consultoría.",
        ],
        sections: [
            {
                title: "Capacidades aplicadas",
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
                title: "Formación y enfoque clínico",
                text: "Su práctica clínica se orienta a comprender el funcionamiento psicológico de cada persona en el contexto de su historia, sus vínculos y las circunstancias que dan forma a su experiencia. Integra aportes de distintos modelos contemporáneos de psicoterapia, incluyendo la Terapia Basada en Mentalización, seleccionando las estrategias de intervención de acuerdo con la formulación clínica, la evidencia disponible y las características de cada caso.",
            },
            {
                title: "Gestión y liderazgo institucional",
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
            <section aria-labelledby="staff-title" className="border-t border-[#d8cfc0] bg-[#fffdf8] py-16 sm:py-24">
                <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 max-w-[46rem]">
                        <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Equipo</p>
                        <h2 id="staff-title" className="crc-serif mt-3 text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-[#171713] text-balance">
                            Las personas detrás de cada servicio
                        </h2>
                        <p className="mt-4 text-[1rem] leading-[1.7] text-[#55574f]">
                            Profesionales con trayectoria clínica, institucional y de gestión. Selecciona a cada persona para ver su perfil.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                        {teamMembers.map((person) => (
                            <button
                                key={person.name}
                                onClick={() => setSelectedPerson(person)}
                                type="button"
                                className="group flex cursor-pointer flex-col text-left transition-transform duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fffdf8]"
                            >
                                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[6px] bg-white ring-1 ring-[#d8cfc0] transition-shadow group-hover:ring-[#9f5528]">
                                    <Image
                                        src={person.img}
                                        alt={person.name}
                                        fill
                                        sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 100vw"
                                        className="object-cover object-top"
                                    />
                                </div>
                                <h3 className="crc-serif mt-4 text-[1.3rem] font-medium leading-[1.2] text-[#171713] transition-colors group-hover:text-[#9f5528]">{person.name}</h3>
                                <p className="mt-1 text-[0.9375rem] font-semibold text-[#171713]">{person.shortRole}</p>
                                <p className="mt-1 text-[0.9375rem] leading-[1.55] text-[#55574f]">{person.desc}</p>
                                <span className="mt-3 text-[0.9375rem] font-semibold text-[#9f5528] underline decoration-[#d8cfc0] underline-offset-4">
                                    Ver perfil
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
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#15120e]/60 p-4 sm:p-6"
                        onClick={() => setSelectedPerson(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 12 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            role="dialog"
                            aria-modal="true"
                            aria-label={selectedPerson.name}
                            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[6px] border border-[#d8cfc0] bg-[#fffdf8] shadow-[0_24px_60px_-20px_rgba(21,18,14,0.45)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setSelectedPerson(null)}
                                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-[6px] text-[#55574f] transition hover:bg-[#f8f5ee] hover:text-[#171713]"
                                aria-label="Cerrar"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Header */}
                            <div className="flex flex-col items-start gap-6 border-b border-[#d8cfc0] bg-[#f8f5ee] px-6 pb-8 pt-10 sm:flex-row sm:px-10">
                                <div className="relative h-40 w-32 shrink-0 overflow-hidden rounded-[6px] bg-white ring-1 ring-[#d8cfc0] sm:h-48 sm:w-36">
                                    <Image
                                        src={selectedPerson.img}
                                        alt={selectedPerson.name}
                                        fill
                                        sizes="144px"
                                        className="object-cover object-top"
                                    />
                                </div>
                                <div className="text-left">
                                    <h3 className="crc-serif text-[1.6rem] font-medium leading-[1.15] text-[#171713]">
                                        {selectedPerson.name}
                                    </h3>
                                    <p className="mt-2 text-[0.9375rem] font-semibold text-[#9f5528]">
                                        {selectedPerson.role}
                                    </p>
                                    <p className="mt-2 text-[0.9375rem] leading-[1.6] text-[#55574f]">
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
                                                    className="inline-flex min-h-10 items-center gap-1.5 rounded-[6px] border border-[#d8cfc0] bg-[#fffdf8] px-3.5 py-1.5 text-[0.875rem] font-semibold text-[#171713] transition hover:border-[#9f5528] hover:text-[#9f5528]"
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
                                        <p key={i} className={`text-[1rem] leading-[1.7] text-[#55574f] ${i > 0 ? "mt-4" : ""}`}>
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                {/* Additional sections */}
                                {selectedPerson.sections.map((section) => (
                                    <div key={section.title} className="border-t border-[#d8cfc0] pt-5">
                                        <h4 className="crc-serif mb-3 text-[1.25rem] font-medium text-[#171713]">
                                            {section.title}
                                        </h4>
                                        <p className="text-[1rem] leading-[1.7] text-[#55574f]">
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
