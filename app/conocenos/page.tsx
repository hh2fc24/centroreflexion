"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BarChart3, GraduationCap, Instagram, Linkedin, Mail, ShieldCheck, Workflow } from "lucide-react";

export default function About() {
    return (
        <div className="bg-[#fffdf8]">
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden bg-[#171713] py-20 sm:py-32 lg:py-40">
                <div className="absolute inset-0 -z-10 bg-[#0f0d0a]/60" />
                <div className="absolute inset-0 -z-20">
                    <Image
                        src="/images/consulting_hero.png"
                        alt="Library background"
                        fill
                        className="object-cover opacity-20"
                    />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl lg:text-4xl font-serif"
                    >
                        Quiénes Somos
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#eee8dc] font-light sm:text-xl sm:leading-8"
                    >
                        Un equipo interdisciplinario dedicado a pensar, cuidar e intervenir con rigor.
                    </motion.p>
                </div>
            </div>

            {/* Mission & Vision */}
            <section className="bg-[#f8f5ee] py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-4"
                        >
                            <span className="mb-4 inline-flex rounded-[5px] bg-[#fffdf8] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#9f5528] ring-1 ring-[#ead8c7]">
                                Nuestro enfoque
                            </span>
                            <h3 className="text-3xl font-bold leading-tight text-[#171713] font-serif sm:text-4xl">
                                Pensamiento crítico con práctica situada.
                            </h3>
                            <p className="mt-5 text-base leading-7 text-[#70695f]">
                                CRC reúne trayectorias distintas para leer problemas complejos con rigor, sensibilidad institucional y responsabilidad ética.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-8"
                        >
                            <div className="divide-y divide-[#ded5c7] border-y border-[#ded5c7]">
                                <div className="grid gap-3 py-6 sm:grid-cols-[120px_1fr]">
                                    <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-[#bd6f3c]">Misión</h4>
                                    <p className="text-lg leading-8 text-[#55574f]">
                                        Cultivar un espacio de pensamiento crítico aplicado, formación y práctica profesional orientado a la salud mental, la infancia, la educación y las instituciones que sostienen la vida común.
                                    </p>
                                </div>
                                <div className="grid gap-3 py-6 sm:grid-cols-[120px_1fr]">
                                    <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-[#bd6f3c]">Visión</h4>
                                    <p className="text-lg leading-8 text-[#55574f]">
                                        Consolidar una comunidad interdisciplinaria capaz de articular ciencias sociales, clínica, salud mental, educación, gestión y tecnología desde una mirada ética, situada y rigurosa.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {["Rigor", "Cuidado", "Interdisciplina", "Evidencia", "Contexto"].map((item) => (
                                    <span key={item} className="rounded-full bg-[#fffdf8] px-3 py-1.5 text-xs font-semibold text-[#70695f] ring-1 ring-[#ead8c7]">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <div id="equipo" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <div className="space-y-16 sm:space-y-24">
                    <div className="max-w-3xl">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Equipo base</span>
                        <h2 className="mt-3 text-3xl font-bold text-[#171713] font-serif sm:text-4xl">Tres trayectorias, una lectura común.</h2>
                        <p className="mt-4 text-base leading-7 text-[#70695f]">
                            Presentamos al equipo desde su rol, formación y aporte disciplinar. La información de prestaciones específicas se organiza en la sección de servicios.
                        </p>
                    </div>

                    {/* Juan Carlos Rauld */}
                    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
                        <div className="lg:col-span-4 flex flex-col items-center text-center lg:text-left lg:items-start">
                            <div className="relative mb-6 h-72 w-56 overflow-hidden rounded-[6px] bg-white shadow-sm ring-1 ring-[#eee8dc] sm:h-80 sm:w-64">
                                <Image
                                    src="/images/juan_carlos_real_white.png"
                                    alt="Juan Carlos Rauld"
                                    width={640}
                                    height={900}
                                    className="h-full w-full object-contain object-center"
                                />
                            </div>
                            <h3 className="text-3xl font-bold text-[#171713] font-serif">Juan Carlos Rauld</h3>
                            <p className="text-[#bd6f3c] font-bold text-sm tracking-wide mt-2 uppercase">Director CRC & Consultor en Ciencias Sociales</p>
                            <p className="text-[#bd6f3c] text-xs mt-1 font-medium">Doctorando en Trabajo Social de la Universidad Rovira i Virgili, Facultad de Ciencias Jurídicas y Sociales, España</p>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <a
                                    href="https://uc-cl.academia.edu/JUANCARLOSRAULDFAR%C3%8DAS"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Ver perfil académico de Juan Carlos Rauld en Academia.edu"
                                    className="inline-flex h-10 items-center gap-2 rounded-full bg-[#bd6f3c] px-4 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-md transition-all hover:scale-[1.02] hover:bg-[#9f5528]"
                                >
                                    <GraduationCap className="h-5 w-5" />
                                    Academia.edu
                                </a>
                                <a href="https://www.linkedin.com/in/juan-carlos-rauld-farias-a64710a4/" target="_blank" rel="noopener noreferrer" className="text-[#8a8276] hover:text-[#bd6f3c] transition-colors"><Linkedin className="h-6 w-6" /></a>
                            </div>
                        </div>
                        <div className="space-y-8 lg:col-span-8">
                            <div>
                                <h4 className="text-xl font-semibold text-[#171713] mb-4 border-b border-[#ded5c7] pb-2">Rol Editorial y Académico</h4>
                                <p className="text-[#55574f] leading-relaxed">
                                    <strong>Juan Carlos Rauld es trabajador social formado en la Universidad Tecnológica Metropolitana (UTEM).</strong> Magíster en Pensamiento Contemporáneo en Filosofía y Pensamiento Político del Instituto de Filosofía de la Universidad Diego Portales. Actualmente es <strong>doctorando en Trabajo Social de la Universidad Rovira i Virgili, Facultad de Ciencias Jurídicas y Sociales, España</strong>. Investigador del Centro de Reflexiones Críticas, sus áreas de interés son el trauma psíquico infantil, la filosofía social y política contemporánea, especialmente la biopolítica de la infancia pobre en Chile y la filosofía de la infancia. Posee una doble especialización en salud mental infantil y en filosofía práctica de la niñez, desde el siglo XIX hasta la actualidad. Actualmente, le interesa evaluar metodológicamente la calidad de la intervención clínica especializada con niños, niñas y adolescentes en situaciones de desprotección, así como la fidelidad de implementación de programas y políticas públicas con enfoque basado en evidencia científica.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-[#171713] mb-4 border-b border-[#ded5c7] pb-2">Trayectoria Institucional</h4>
                                <p className="text-[#55574f] leading-relaxed">
                                    Su experiencia cruza programas de infancia, salud mental, protección de derechos y análisis institucional. Ha trabajado en espacios donde la intervención exige lectura técnica, criterio ético, coordinación de equipos y comprensión de los marcos públicos que organizan la protección social.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-[#171713] mb-4 border-b border-[#ded5c7] pb-2">Actividades e Intervenciones Públicas</h4>
                                <div className="mt-4 rounded-[8px] border border-[#eee8dc] bg-[#f8f5ee] p-5">
                                    <div className="grid gap-6 sm:grid-cols-[140px_1fr] items-center">
                                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] border border-[#eee8dc] bg-white sm:aspect-[1/1]">
                                            <Image
                                                src="/JC.jpeg"
                                                alt="Juan Carlos Rauld en la Furia del Libro"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#bd6f3c]">Estación Mapocho · Mayo 2026</span>
                                            <h5 className="text-base font-bold text-[#171713] mt-1 font-serif">Presentación en La Furia del Libro</h5>
                                            <p className="mt-2 text-xs leading-relaxed text-[#55574f]">
                                                El Centro de Reflexiones Críticas estuvo presente en la versión invernal de <strong>La Furia del Libro 2026</strong>, celebrada en el histórico Centro Cultural Estación Mapocho del 28 al 31 de mayo. Nuestro director, Juan Carlos Rauld, participó de este importante encuentro de edición independiente en el marco de la presentación y discusión sobre su obra <em>&quot;Tecnócratas de la Infancia&quot;</em> (Editorial Hammurabi), abriendo un debate crítico sobre la biopolítica, la institucionalización de la pobreza y las deudas de la protección social en Chile.
                                            </p>
                                            <div className="mt-3">
                                                <Link
                                                    href="/publicaciones"
                                                    className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#bd6f3c] hover:text-[#9f5528] transition-colors"
                                                >
                                                    Ver entrevista y video de la actividad →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-[#eee8dc]" />

                    {/* Rocío Solar */}
                    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
                        <div className="lg:col-span-4 flex flex-col items-center text-center lg:text-left lg:items-start lg:order-last">
                            <div className="relative mb-6 h-72 w-56 overflow-hidden rounded-[6px] bg-white shadow-sm ring-1 ring-[#eee8dc] sm:h-80 sm:w-64">
                                <Image
                                    src="/images/rocio_solar_real_white.png"
                                    alt="Rocío Solar"
                                    width={640}
                                    height={900}
                                    className="h-full w-full object-contain object-center"
                                />
                            </div>
                            <h3 className="text-3xl font-bold text-[#171713] font-serif">Rocío Solar</h3>
                            <p className="text-[#bd6f3c] font-bold text-sm tracking-wide mt-2 uppercase">
                                Terapeuta Ocupacional · Académica · Cofundadora CRC
                            </p>
                            <p className="text-[#bd6f3c] text-sm font-semibold mt-1">Salud mental infanto-juvenil</p>
                            <p className="text-[#70695f] text-xs mt-1 font-medium leading-snug">Magíster (c) en Ocupación y Terapia Ocupacional<br />Facultad de Medicina, Universidad de Chile</p>
                            <div className="mt-6 flex gap-4">
                                <a href="https://www.instagram.com/centrodereflexionescriticas/" target="_blank" rel="noopener noreferrer" className="text-[#8a8276] hover:text-[#bd6f3c] transition-colors"><Instagram className="h-6 w-6" /></a>
                                <Link href="/contacto" className="text-[#8a8276] hover:text-[#bd6f3c] transition-colors"><Mail className="h-6 w-6" /></Link>
                                <a href="https://www.linkedin.com/in/roc%C3%ADo-solar-guerra-168693138/" target="_blank" rel="noopener noreferrer" className="text-[#8a8276] hover:text-[#bd6f3c] transition-colors"><Linkedin className="h-6 w-6" /></a>
                            </div>
                        </div>
                        <div className="space-y-8 lg:col-span-8 lg:text-right">
                            <div>
                                <h4 className="text-xl font-semibold text-[#171713] mb-4 border-b border-[#ded5c7] pb-2 lg:ml-auto lg:w-fit">Trayectoria Profesional</h4>
                                <p className="text-[#55574f] leading-relaxed">
                                    Rocío Solar es terapeuta ocupacional, académica y cofundadora del CRC, con 9 años de experiencia clínica y psicosocial en salud mental infanto-juvenil. Su trayectoria se ha desarrollado principalmente en evaluación e intervención terapéutica con niños, niñas, adolescentes y sus familias, abordando procesos asociados a regulación emocional, participación ocupacional, crisis en salud mental y acompañamiento en contextos de alta complejidad.
                                </p>
                                <p className="mt-4 text-[#55574f] leading-relaxed">
                                    Ha trabajado en dispositivos de salud pública, atención clínica particular y programas especializados de salud mental, desarrollando procesos terapéuticos individuales, familiares y grupales desde un enfoque integral y centrado en la singularidad de cada persona. Su experiencia incluye trabajo interdisciplinario, elaboración de estrategias de intervención clínica, acompañamiento a establecimientos educacionales y coordinación con redes de apoyo para favorecer la continuidad de cuidados y la participación en la vida cotidiana.
                                </p>
                                <p className="mt-4 text-[#55574f] leading-relaxed">
                                    Además de su labor clínica, ha participado en docencia universitaria y formación de estudiantes de terapia ocupacional en contextos de salud mental, integrando práctica clínica, reflexión crítica y trabajo basado en evidencia.
                                </p>
                                <p className="mt-4 text-[#55574f] leading-relaxed">
                                    Actualmente desarrolla atención clínica particular con población infanto-juvenil y procesos de investigación vinculados a salud mental, ocupación y cuidados alternativos.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-[#171713] mb-4 border-b border-[#ded5c7] pb-2 lg:ml-auto lg:w-fit">Formación y Enfoque</h4>
                                <p className="text-[#55574f] leading-relaxed">
                                    Su enfoque clínico integra terapia ocupacional, salud mental y perspectivas relacionales, comprendiendo el bienestar y la participación ocupacional como procesos profundamente vinculados a las experiencias cotidianas, los vínculos y los contextos de vida.
                                </p>
                                <p className="mt-4 text-[#55574f] leading-relaxed">
                                    Cuenta con formación en salud mental y psiquiatría comunitaria, género e intervención psicosocial, reducción de daños y prácticas basadas en evidencia. Actualmente cursa el Magíster en Ocupación y Terapia Ocupacional de la Universidad de Chile, donde desarrolla una investigación tipo scoping review sobre cuidados alternativos, infancia y terapia ocupacional.
                                </p>
                                <p className="mt-4 text-[#55574f] leading-relaxed">
                                    Su práctica clínica se caracteriza por una mirada sensible, ética y respetuosa de la singularidad de cada persona, promoviendo procesos terapéuticos que favorezcan la regulación emocional, la autonomía, el fortalecimiento de vínculos y la participación significativa en la vida cotidiana.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-[#eee8dc]" />

                    {/* Hugo Felipe Hormazábal */}
                    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
                        <div className="lg:col-span-4 flex flex-col items-center text-center lg:text-left lg:items-start">
                            <div className="relative mb-6 h-72 w-56 overflow-hidden rounded-[6px] bg-white shadow-sm ring-1 ring-[#eee8dc] sm:h-80 sm:w-64">
                                <Image
                                    src="/images/hugo-hormazabal-crc-2026-large.png"
                                    alt="Hugo Felipe Hormazábal"
                                    width={640}
                                    height={900}
                                    className="h-full w-full object-contain object-center"
                                />
                            </div>
                            <h3 className="text-3xl font-bold text-[#171713] font-serif">Hugo Felipe Hormazábal</h3>
                            <p className="text-[#bd6f3c] font-bold text-sm tracking-wide mt-2 uppercase">
                                Estrategia Tecnológica, Ingeniería de Servicios e Inteligencia Aplicada
                            </p>
                            <p className="text-[#70695f] text-xs mt-2 font-medium leading-snug">
                                Ingeniero Comercial
                            </p>

                            <div className="mt-6 flex gap-4">
                                <a href="https://www.linkedin.com/in/hugo-felipe-hormazabal-561005332/" target="_blank" rel="noopener noreferrer" aria-label="Perfil de LinkedIn de Hugo Felipe Hormazábal" className="text-[#8a8276] hover:text-[#bd6f3c] transition-colors"><Linkedin className="h-6 w-6" /></a>
                                <a href="https://www.altiusignite.com" target="_blank" rel="noopener noreferrer" aria-label="Sitio web de Altius Ignite" className="text-[#8a8276] hover:text-[#bd6f3c] transition-colors"><Workflow className="h-6 w-6" /></a>
                                <Link href="/contacto" className="text-[#8a8276] hover:text-[#bd6f3c] transition-colors"><Mail className="h-6 w-6" /></Link>
                            </div>
                        </div>
                        <div className="space-y-8 lg:col-span-8">
                            <div>
                                <h4 className="text-xl font-semibold text-[#171713] mb-4 border-b border-[#ded5c7] pb-2">Trayectoria Profesional</h4>
                                <p className="text-[#55574f] leading-relaxed">
                                    Hugo Felipe Hormazábal es Ingeniero Comercial y fundador de <a href="https://www.altiusignite.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#9f5528] underline decoration-[#dec0a8] underline-offset-4 hover:text-[#bd6f3c]">Altius Ignite</a>, empresa de transformación digital desde la cual desarrolla soluciones de automatización, inteligencia artificial, datos y arquitectura tecnológica aplicada. En el CRC lidera la visión tecnológica y la ingeniería de servicios: traduce necesidades clínicas, sociales e institucionales en sistemas, datos, flujos y herramientas digitales que permiten sostener intervenciones con mayor trazabilidad, continuidad y capacidad de aprendizaje.
                                </p>
                                <p className="mt-4 text-[#55574f] leading-relaxed">
                                    Cuenta con más de 15 años de experiencia articulando operaciones, crecimiento, experiencia de cliente, inteligencia de negocio y transformación digital en industrias exigentes como contact center/BPO, banca, fintech, tecnología, retail, servicios, educación y consultoría. Complementa su formación con un Diplomado en Marketing & Analytics por la Universidad Adolfo Ibáñez (UAI). Ha implementado y escalado operaciones y líneas de negocio en Chile, Colombia, Argentina, Perú y Bolivia, liderando equipos multiculturales de hasta 700 FTE, procesos de mejora continua, automatización intensiva, implementación de CRM, reportería ejecutiva, arquitecturas digitales y soluciones basadas en inteligencia artificial aplicada a productividad, control operativo y toma de decisiones.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-[#171713] mb-4 border-b border-[#ded5c7] pb-2">Formación, Tecnología y Experiencia Aplicada</h4>
                                <div className="grid gap-3 sm:grid-cols-3">
                                    {[
                                        { icon: Workflow, title: "Ingeniería de servicios", text: "Procesos, flujos, seguimiento y arquitectura de gestión." },
                                        { icon: BarChart3, title: "Inteligencia aplicada", text: "Datos, indicadores, reporting ejecutivo y analítica institucional." },
                                        { icon: ShieldCheck, title: "Automatización e IA", text: "Herramientas digitales para productividad, control y decisión." },
                                    ].map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={item.title} className="rounded-[8px] border border-[#eee8dc] bg-[#fffdf8] p-4">
                                                <Icon className="mb-3 h-5 w-5 text-[#bd6f3c]" />
                                                <h5 className="text-sm font-bold text-[#171713]">{item.title}</h5>
                                                <p className="mt-2 text-xs leading-5 text-[#70695f]">{item.text}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 rounded-[8px] border border-[#eee8dc] bg-[#f8f5ee] p-4">
                                    <div className="grid gap-4 text-xs leading-5 text-[#55574f] sm:grid-cols-[0.9fr_1.1fr]">
                                        <div>
                                            <p className="mb-2 font-bold uppercase tracking-[0.14em] text-[#8a8276]">Credenciales</p>
                                            <p>AWS Business · Scrum Foundation · Lifelong Learning · Equipos de alto rendimiento</p>
                                        </div>
                                        <div className="sm:border-l sm:border-[#ded5c7] sm:pl-4">
                                            <p className="mb-2 font-bold uppercase tracking-[0.14em] text-[#8a8276]">Stack aplicado</p>
                                            <p>Salesforce · HubSpot · Power BI · APIs · Supabase · Vercel · IA aplicada</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-[#eee8dc]" />

                </div>
            </div>
        </div>
    );
}
