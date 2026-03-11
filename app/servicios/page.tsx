"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, ArrowRight, Users, Mail, Brain, HeartHandshake, Rocket } from "lucide-react";

export default function Services() {
    const [activePillar, setActivePillar] = useState<number>(0);
    const formacionRef = useRef<HTMLElement>(null);
    const { scrollYProgress: formacionScrollY } = useScroll({
        target: formacionRef,
        offset: ["start end", "end start"]
    });

    // Parallax values for instructor portraits
    const yJuanCarlos = useTransform(formacionScrollY, [0, 1], [-150, 150]);
    const yRocio = useTransform(formacionScrollY, [0, 1], [150, -150]);

    const consultingPillars = [
        {
            id: "clinico",
            title: "Consultoría Estratégica",
            icon: Brain,
            description: "Liderado por JCR. Desarrollamos asesoría estratégica y organizacional centrada en enfoques de salud mental infantil basados en evidencia. Además, ayudamos a que tu organización ordene sus procesos técnicos en la toma de decisiones a través de tecnología aplicada, con el objetivo que los equipos profesionales y humanos funcionen con estándares, coherencia y resultados sostenibles.",
            bgImage: "/images/pillar_clinico.png",
        },
        {
            id: "territorio",
            title: "Salud Mental e Inclusión Educativa",
            icon: HeartHandshake,
            description: "Liderado por Rocío Solar. Diseñamos estrategias situadas que articulan salud mental, inclusión educativa y trabajo territorial para convertir el diseño técnico en bienestar tangible para comunidades y espacios formativos.",
            bgImage: "/images/pillar_territorio.png",
        },
        {
            id: "tecnologia",
            title: "Motor Tecnológico",
            icon: Rocket,
            description: "Powered by Altius Ignite. Transformamos tu modelo en un flujo medible en tiempo real. Construimos el ecosistema de software (SuitS, CRM) que permite a tus equipos operar impecablemente a gran escala.",
            bgImage: "/images/pillar_tecnologia.png",
        }
    ];

    return (
        <div className="bg-white">

            {/* Header */}
            <div className="bg-gray-50 py-16 sm:py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl font-serif"
                    >
                        Nuestros Servicios
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto mt-6 max-w-3xl text-base leading-7 text-gray-600 sm:text-xl sm:leading-8"
                    >
                        <p>
                            Una oferta integral que combina la <strong>atención clínica especializada</strong>,
                            la <strong>formación académica</strong> y la <strong>consultoría estratégica</strong> para instituciones.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* A) Consultoría Estratégica (The "Umbrella" Offer) */}
            <section id="consultoria" className="relative overflow-hidden border-b border-slate-800 bg-slate-900 py-20 sm:py-24 lg:py-32">
                {/* Abstract Background Assets */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 h-full w-full opacity-15 mix-blend-overlay sm:w-3/4 sm:opacity-20">
                        {/* We use the abstract network image here as a subtle background texture */}
                        <div className="relative w-full h-full">
                            <img src="/images/consulting_hero.png" alt="Abstract Network" className="object-cover w-full h-full" />
                            <div className="absolute inset-0 bg-slate-900/40"></div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="items-start gap-10 lg:grid lg:grid-cols-12 lg:gap-16">

                        {/* Left Column: Strategic Vision */}
                        <div className="mb-12 lg:col-span-5 lg:mb-0">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                viewport={{ once: true }}
                            >
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="mb-6 inline-flex items-center rounded-full border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-transparent px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)] backdrop-blur-md sm:mb-8"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse"></div>
                                    Consultoría Integral CRC
                                </motion.span>
                                <h2 className="mb-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:mb-8 md:text-5xl lg:text-6xl font-serif">
                                    Elevemos el <br />
                                    Estándar del <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-sm">
                                        Impacto Social
                                    </span>
                                </h2>
                                <p className="mb-10 max-w-xl border-l-2 border-amber-500/40 pl-4 text-base font-light leading-relaxed text-slate-300 sm:mb-12 sm:pl-6 sm:text-lg lg:pl-8">
                                    Las grandes transformaciones no se sostienen con buenas intenciones ni hojas de cálculo. Unimos nuestra profunda experiencia clínica y comunitaria con la precisión tecnológica de <strong>Altius Ignite</strong>.<br /><br />
                                    El resultado: diseños psicosociales de alto nivel, ejecutados y medidos con impecabilidad de software. Así garantizamos que tu institución deje un legado real.
                                </p>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="block sm:inline-block"
                                >
                                    <Button size="lg" className="w-full rounded-lg border-none bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-5 font-bold text-slate-950 shadow-[0_0_40px_rgba(245,158,11,0.3)] transition-all duration-300 hover:from-amber-400 hover:to-amber-500 sm:w-auto sm:px-10 sm:py-7 group">
                                        Agendar Reunión Ejecutiva
                                        <ArrowRight className="ml-3 h-5 w-5 text-slate-900 group-hover:translate-x-1.5 transition-transform duration-300" />
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Right Column: Service Matrix */}
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.15 }
                                }
                            }}
                            className="relative lg:col-span-7"
                        >
                            {/* Ambient subtle glow behind the cards */}
                            <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[80px] sm:h-3/4 sm:w-3/4 sm:blur-[120px]"></div>

                            <div className="flex h-auto w-full flex-col gap-3 sm:gap-4 md:h-[600px] md:flex-row">
                                {consultingPillars.map((pillar, idx) => {
                                    const isActive = activePillar === idx;
                                    const Icon = pillar.icon;

                                    return (
                                        <motion.div
                                            key={pillar.id}
                                            onClick={() => setActivePillar(idx)}
                                            className={`group relative flex cursor-pointer overflow-hidden rounded-2xl border backdrop-blur-md transition-[flex-grow,width,height] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? "min-h-[300px] flex-grow bg-amber-500/10 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)] sm:min-h-[340px] md:min-h-0 md:w-[70%] lg:w-[76%]" : "min-h-[84px] bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/50 md:min-h-0 md:w-[15%] lg:w-[12%]"}`}
                                            role="button"
                                            tabIndex={0}
                                            aria-pressed={isActive}
                                            layout
                                        >
                                            {/* Background Image (only visible if active) */}
                                            <div className={`absolute inset-0 transition-opacity duration-700 ${isActive ? "opacity-40" : "opacity-0"}`}>
                                                <img src={pillar.bgImage} className="w-full h-full object-cover mix-blend-overlay" />
                                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
                                            </div>

                                            <div className={`relative z-10 flex w-full ${isActive ? "h-full flex-col justify-end p-5 sm:p-6 lg:p-8" : "flex-row items-center p-4 md:h-full md:flex-col md:justify-center"}`}>

                                                {/* Inactive Icon & Vertical Title / Active Top Logo */}
                                                <div className={`flex items-center justify-center transition-all ${isActive ? "absolute top-5 left-5 sm:top-6 sm:left-6 md:top-8 md:left-8" : "md:h-full md:flex-col"}`}>
                                                    <div className={`flex items-center justify-center rounded-xl border bg-slate-900/50 shadow-inner transition-all duration-500 ${isActive ? "h-14 w-14 border-amber-500/50 sm:h-16 sm:w-16" : "h-12 w-12 border-slate-700 group-hover:border-amber-500/30"}`}>
                                                        <Icon className={`transition-all duration-500 ${isActive ? "w-8 h-8 text-amber-500" : "w-6 h-6 text-slate-400 group-hover:text-amber-500"}`} />
                                                    </div>

                                                    {/* Title text rotated on desktop inactive */}
                                                    {!isActive && (
                                                        <span className="ml-4 font-serif font-bold tracking-wider text-slate-300 transition-colors group-hover:text-amber-400 md:ml-0 md:mt-8 md:-rotate-180 md:[writing-mode:vertical-rl] md:whitespace-nowrap">
                                                            {pillar.title}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Active Content */}
                                                <div className={`flex flex-col transition-all duration-700 delay-150 ${isActive ? "translate-y-0 opacity-100" : "hidden translate-y-8 opacity-0"}`}>
                                                    <h3 className="mb-4 pr-2 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl font-serif">{pillar.title}</h3>
                                                    <p className="mb-6 max-w-xl text-sm font-light leading-relaxed text-slate-300 sm:mb-8 sm:text-base md:text-lg">{pillar.description}</p>
                                                    {pillar.id === "casos" ? (
                                                        <div className="flex items-center text-amber-400 font-bold uppercase tracking-widest text-sm hover:text-amber-300 w-max group/btn cursor-pointer">
                                                            Ver Proyectos <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-transparent rounded-full opacity-70"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* A) Atención Clínica Juan Carlos */}
            <section id="clinica" className="border-b border-gray-100 bg-white py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                        <div>
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-6">
                                Dirección Clínica
                            </span>
                            <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-serif">
                                Evaluación Psicosocial
                            </h2>
                            <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg">
                                Servicios especializados dirigidos por Juan Carlos Rauld, enfocados en la evaluación pericial y consultoría de casos complejos en infancia y familia.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {[
                                    { name: "Evaluación de Competencias Parentales", price: "Desde 3 UF" },
                                    { name: "Consultoría Psicosocial Clínica", price: "2.5 UF / Sesión" },
                                    { name: "Evaluación de Riesgo Psicosocial", price: "A cotizar" },
                                    { name: "Informes Sociales Periciales", price: "Desde 4 UF" },
                                    { name: "Visitas Domiciliarias", price: "Desde 3 UF" }
                                ].map((item, idx) => (
                                    <li key={idx} className="group -mx-2 flex flex-col gap-2 rounded-lg border-b border-gray-100 px-2 pb-3 transition-colors hover:bg-gray-50/50 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:pb-2">
                                        <div className="flex items-center text-gray-700">
                                            <Check className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                            <span className="group-hover:text-blue-900 transition-colors">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 sm:ml-4">{item.price}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                                Solicitar Evaluación
                            </Button>
                        </div>
                        <div className="relative h-[320px] overflow-hidden rounded-2xl shadow-2xl sm:h-[420px] lg:h-[500px]">
                            <video
                                className="absolute inset-0 h-full w-full object-cover"
                                src="/22.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent" />
                        </div>
                    </div>
                </div>
            </section >

            {/* B) Atención Clínica Rocío Solar */}
            < section id="terapia-ocupacional" className="border-b border-gray-100 bg-gray-50 py-16 sm:py-24" >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                        <div className="order-last relative h-[320px] overflow-hidden rounded-2xl shadow-2xl sm:h-[420px] lg:order-first lg:h-[500px]">
                            <video
                                className="absolute inset-0 h-full w-full object-cover"
                                src="/44.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent" />
                        </div>

                        <div>
                            <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 mb-6">
                                Salud Mental y Terapia Ocupacional
                            </span>
                            <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-serif">
                                Intervención Comunitaria y Clínica
                            </h2>
                            <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg">
                                Espacio terapéutico liderado por Rocío Solar, centrado en la funcionalidad, el bienestar y los derechos humanos.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                                {[
                                    "Terapia Ocupacional Online",
                                    "Intervención Domiciliaria",
                                    "Acompañamiento en Terreno",
                                    "Consejería Familiar"
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                                            <Users className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <span className="font-medium text-gray-900">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                                Agendar con Rocío
                            </Button>
                        </div>
                    </div>
                </div>
            </section >

            {/* C) Servicios de Formación */}
            < section ref={formacionRef} id="formacion" className="relative overflow-hidden bg-zinc-950 py-16 sm:py-24" >
                {/* Widescreen Parallax Backgrounds */}
                <motion.div style={{ y: yJuanCarlos }} className="pointer-events-none absolute top-0 -right-12 z-0 h-[280px] w-[280px] opacity-[0.18] sm:h-[500px] sm:w-[500px] sm:opacity-[0.25] md:-right-24 md:h-[700px] md:w-[700px] md:opacity-[0.35] lg:-right-32 lg:h-[1000px] lg:w-[1000px] lg:opacity-[0.45]">
                    <img
                        src="/images/juan_carlos_20260224.png"
                        alt=""
                        className="w-full h-full object-cover object-right-top filter"
                        style={{ WebkitMaskImage: "radial-gradient(ellipse at top right, black 25%, transparent 75%)", maskImage: "radial-gradient(ellipse at top right, black 25%, transparent 75%)" }}
                    />
                </motion.div>
                <motion.div style={{ y: yRocio }} className="pointer-events-none absolute bottom-0 -left-12 z-0 h-[280px] w-[280px] opacity-[0.18] sm:h-[500px] sm:w-[500px] sm:opacity-[0.25] md:-left-24 md:h-[700px] md:w-[700px] md:opacity-[0.35] lg:-left-32 lg:h-[1000px] lg:w-[1000px] lg:opacity-[0.45]">
                    <img
                        src="/images/rocio_solar.png"
                        alt=""
                        className="w-full h-full object-cover object-left-bottom filter"
                        style={{ WebkitMaskImage: "radial-gradient(ellipse at bottom left, black 25%, transparent 75%)", maskImage: "radial-gradient(ellipse at bottom left, black 25%, transparent 75%)" }}
                    />
                </motion.div>

                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-12 text-center sm:mb-16">
                        <span className="inline-flex items-center rounded-full bg-zinc-800/50 border border-zinc-700 px-3 py-1 text-sm font-medium text-zinc-300 backdrop-blur-sm mb-4">Servicios</span>
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mt-2 font-serif">Formación y Capacitación</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
                            Instancias de aprendizaje para equipos profesionales, comunidades educativas y organizaciones.
                        </p>
                        <p className="mt-2 text-sm text-zinc-500 italic">
                            * Los precios indicados son referenciales y están sujetos a confirmación.
                        </p>
                    </div>

                    {/* Juan Carlos Rauld - Formación */}
                    <div className="relative mb-16 sm:mb-24">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-8 font-serif border-b border-zinc-800 pb-4">
                                Formación — <span className="text-blue-400">Juan Carlos Rauld</span>
                            </h3>
                            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                                {[
                                    { name: "Capacitación en Intervención de Crisis", price: "Desde 5 UF", detail: "Modalidad presencial / online · 4-8 hrs" },
                                    { name: "Supervisión Clínica de Casos", price: "2.5 UF / Sesión", detail: "Para equipos de protección infantil" },
                                    { name: "Formación en Gestión de Programas Sociales", price: "Desde 8 UF", detail: "Incluye material y certificación" },
                                    { name: "Taller de Evaluación Pericial", price: "Desde 6 UF", detail: "Competencias parentales y riesgo" },
                                    { name: "Asesoría Estratégica Institucional", price: "A cotizar", detail: "Diseño de modelos de intervención" },
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] border border-zinc-800/50 hover:border-blue-500/50 group">
                                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{item.name}</h4>
                                        <p className="text-sm text-zinc-400 mb-4">{item.detail}</p>
                                        <span className="inline-flex items-center rounded-full bg-blue-900/30 border border-blue-800/50 px-3 py-1 text-sm font-semibold text-blue-300">{item.price} *</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Rocío Solar - Formación */}
                        <div className="relative mt-16 mb-16 sm:mt-24">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-8 font-serif border-b border-zinc-800 pb-4">
                                    Formación — <span className="text-purple-400">Rocío Solar</span>
                                </h3>
                                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                                    {[
                                        { name: "Charlas en Salud Mental y Género", price: "Consultar", detail: "Presencial / Online · 60-90 min" },
                                        { name: "Formación de Equipos en VIF", price: "Consultar", detail: "Certificado de participación incluido" },
                                        { name: "Asesorías PIE", price: "Plan mensual", detail: "Supervisión reflexiva para Programas de Integración Escolar" },
                                        { name: "Taller de Terapia Ocupacional Comunitaria", price: "Consultar", detail: "Enfoque de Derechos Humanos" },
                                        { name: "Capacitación en Acompañamiento en Terreno", price: "Consultar", detail: "Para equipos de salud mental comunitaria" },
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] border border-zinc-800/50 hover:border-purple-500/50 group">
                                            <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{item.name}</h4>
                                            <p className="text-sm text-zinc-400 mb-4">{item.detail}</p>
                                            <span className="inline-flex items-center rounded-full bg-purple-900/30 border border-purple-800/50 px-3 py-1 text-sm font-semibold text-purple-300">{item.price} *</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </section >

            {/* D) Alianza Estratégica Institucional (Altius Ignite + CRC) */}
            < section id="alianza-tecnologica" className="relative overflow-hidden border-t border-b border-slate-800 border-zinc-900 bg-zinc-950 py-20 sm:py-24 lg:py-32" >
                {/* Parallax Background */}
                < div className="absolute inset-0 z-0" >
                    <div
                        className="absolute inset-0 bg-[url('/images/consulting_hero.png')] bg-cover bg-center opacity-15 mix-blend-luminosity"
                        ></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 via-zinc-950/70 to-zinc-900/90 mix-blend-multiply"></div>
                </div >

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="items-center gap-10 lg:grid lg:grid-cols-12 lg:gap-16">

                        {/* Left Column: Context & Synergy */}
                        <div className="mb-12 lg:col-span-5 lg:mb-0">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div className="mb-8 flex items-center">
                                    <div className="relative h-16 w-40 shrink-0 sm:h-20 sm:w-48">
                                        <Image
                                            src="/altius-logo.png"
                                            alt="Logo Altius"
                                            fill
                                            className="object-contain object-left"
                                        />
                                    </div>
                                </div>

                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-300 text-xs font-bold border border-zinc-700 tracking-widest uppercase mb-6 shadow-sm backdrop-blur-md">
                                    Partnership Tecnológico
                                </span>
                                <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl font-serif">
                                    Ciencias Sociales <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-white to-zinc-400">
                                        Potenciadas por Tecnología
                                    </span>
                                </h2>
                                <p className="mb-8 border-l-2 border-zinc-700 pl-4 text-base font-light leading-relaxed text-zinc-400 sm:pl-6 sm:text-lg">
                                    Llevamos nuestras metodologías al siguiente nivel. Gracias a nuestra alianza estratégica con <strong>Altius Ignite</strong>, combinamos la profundidad analítica de las ciencias sociales con software a medida y plataformas avanzadas para multiplicar tu impacto operativo.
                                </p>

                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <a href="https://www.altiusignite.com" target="_blank" rel="noopener noreferrer">
                                        <Button size="lg" className="w-full rounded-none bg-white px-8 py-6 font-bold text-zinc-950 shadow-xl transition-all hover:scale-105 hover:bg-zinc-200 sm:w-auto">
                                            Conoce Altius Ignite
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </a>
                                    <Link href="/contacto">
                                        <Button variant="outline" size="lg" className="w-full rounded-none border-zinc-700 px-8 py-6 text-zinc-300 backdrop-blur-sm hover:border-zinc-500 hover:bg-zinc-800/50 hover:text-white sm:w-auto">
                                            Coordinar Evaluación Conjunta
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column: Value Props */}
                        <div className="lg:col-span-7">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                {/* Prop 1 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-6 hover:bg-zinc-800/50 transition-colors group"
                                >
                                    <div className="h-12 w-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 border border-zinc-700 group-hover:border-zinc-500 transition-colors">
                                        <svg className="w-6 h-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Automatización y Flujos</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed">
                                        Transformamos el ruido organizativo en procesos ordenados. Implementación de CRM y trazabilidad operativa para que ningún caso o intervención se pierda.
                                    </p>
                                </motion.div>

                                {/* Prop 2 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-6 hover:bg-zinc-800/50 transition-colors group"
                                >
                                    <div className="h-12 w-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 border border-zinc-700 group-hover:border-zinc-500 transition-colors">
                                        <svg className="w-6 h-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">SuitS Específicas</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed">
                                        Desarrollo e integración de plataformas dedicadas como <strong>SuitS</strong> para estudios jurídicos, portales privados e interfaces a medida para profesionales.
                                    </p>
                                </motion.div>

                                {/* Prop 3 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    viewport={{ once: true }}
                                    className="relative flex flex-col items-start justify-between overflow-hidden border border-zinc-800 bg-gradient-to-r from-zinc-900 p-6 group md:col-span-2 sm:flex-row sm:items-center sm:p-8"
                                >
                                    <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-zinc-800/20 to-transparent pointer-events-none"></div>
                                    <div className="z-10 mb-6 max-w-lg sm:mb-0">
                                        <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-2 block">Diseño con Estándar</span>
                                        <h3 className="text-xl font-bold text-white mb-2">Dejemos de improvisar</h3>
                                        <p className="text-sm text-zinc-400">Tu operación necesita claridad, no parches. Nuestro enfoque psicosocial asegura que la tecnología se adapte a las personas, no al revés.</p>
                                    </div>
                                    <div className="z-10 shrink-0">
                                        <div className="h-16 w-16 rounded-full border border-zinc-700 flex items-center justify-center shrink-0">
                                            <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                            </div>
                        </div>

                    </div>
                </div>
            </section >

            {/* E) Contact CTA - Bottom */}
            <section className="relative z-10 bg-white py-16 md:py-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-800">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 font-serif">¿Necesitas algo más específico?</h3>
                        <p className="text-gray-300 md:text-lg mb-8 max-w-xl mx-auto font-light">
                            Si requieres una formación personalizada o tienes consultas sobre nuestras prestaciones,
                            escríbenos directamente y diseñemos en conjunto.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="mailto:centrodereflexionescriticas@gmail.com" className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-red-500/25 hover:scale-105">
                                <Mail className="w-5 h-5 mr-2" />
                                Escribir por Email
                            </a>
                            <span className="text-gray-400 text-sm sm:w-48 text-left leading-tight hidden sm:block">o utiliza nuestro asistente virtual</span>
                            <span className="text-gray-400 text-sm sm:hidden">o utiliza nuestro asistente virtual</span>
                        </div>
                    </div>
                </div>
            </section>

        </div >
    );
}
