"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, ArrowRight, Users, Mail, Brain, HeartHandshake, Rocket, Scale, GraduationCap, TrendingUp, Building2, FlaskConical, Gavel, Award, BookOpen, ExternalLink, Briefcase } from "lucide-react";

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

            {/* Header — dark, integrado con sección consultoria */}
            <div className="relative overflow-hidden bg-slate-900 py-20 sm:py-28 lg:py-36">
                {/* Fondo abstracto sutil */}
                <div className="absolute inset-0 z-0 opacity-10">
                    <img src="/images/consulting_hero.png" alt="" className="h-full w-full object-cover mix-blend-luminosity" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900" />
                <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300 backdrop-blur-md"
                    >
                        Centro de Reflexiones Críticas
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl font-serif"
                    >
                        Nuestros Servicios
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-300 sm:text-xl sm:leading-8"
                    >
                        <p>
                            Una oferta integral que combina la <strong className="text-white">atención clínica especializada</strong>,
                            la <strong className="text-white">formación académica</strong> y la <strong className="text-white">consultoría estratégica</strong> con un equipo <strong className="text-amber-400">multidisciplinario</strong> de alto nivel.
                        </p>
                    </motion.div>
                    {/* Tags multidisciplinarios */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 flex flex-wrap items-center justify-center gap-2"
                    >
                        {["Trabajo Social", "Terapia Ocupacional", "Derecho", "Sociología", "Ingeniería Comercial", "Salud Mental"].map((tag) => (
                            <span key={tag} className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400 backdrop-blur-sm">
                                {tag}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* A) Consultoría Estratégica (The "Umbrella" Offer) */}
            <section id="consultoria" className="relative overflow-hidden border-t border-slate-700/50 bg-slate-900 py-20 sm:py-24 lg:py-32">
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
                            <p className="mb-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                                Servicios especializados dirigidos por <strong>Juan Carlos Rauld</strong>, Trabajador Social investigador especializado en infancia, trauma psicosocial y protección de derechos. Focalizados en evaluación pericial y consultoría de casos complejos en infancia y familia.
                            </p>
                            <a href="#recomendaciones-linkedin" className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                                <svg className="h-3.5 w-3.5 fill-[#0077B5]" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                Ver qué dicen colegas y supervisores sobre Juan Carlos →
                            </a>

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
                            <p className="mb-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                                Espacio terapéutico liderado por <strong>Rocío Solar</strong>, Terapeuta Ocupacional con Magíster en Salud Mental Comunitaria (U. de Chile) y especialización en TEA, género e intervención psicosocial. Su enfoque integra funcionalidad, derechos y trabajo territorial en intervenciones clínicas de alto impacto.
                            </p>
                            <a href="#recomendaciones-linkedin" className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                                <svg className="h-3.5 w-3.5 fill-[#0077B5]" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                Ver qué dicen colegas y colaboradores sobre Rocío →
                            </a>

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

            {/* B·6) Psicología y Adicciones */}
            <section id="psicologia-adicciones" className="relative overflow-hidden bg-gray-950 py-20 sm:py-28 lg:py-32">
                {/* Fondo fotográfico con overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/hero_community.png"
                        alt=""
                        className="h-full w-full object-cover opacity-20 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950/90 to-indigo-950/80" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

                        {/* LEFT: Contenido */}
                        <motion.div
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-indigo-300 backdrop-blur-sm">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                Psicología Clínica & Adicciones
                            </span>

                            <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl font-serif">
                                Recuperar el control.<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-400">
                                    Sin juicio. Con método.
                                </span>
                            </h2>

                            <p className="mb-10 border-l-2 border-indigo-500/40 pl-5 text-base font-light leading-relaxed text-gray-300 sm:text-lg">
                                Las adicciones no son debilidades morales: son patrones neurobiológicos y psicosociales que requieren intervención especializada, compasiva y sostenida. Abordamos el consumo problemático de sustancias, adicciones conductuales y comorbilidades asociadas desde un enfoque clínico integral y libre de estigma.
                            </p>

                            {/* Tipos de adicciones */}
                            <div className="mb-10">
                                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-indigo-400">Áreas de intervención</p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "Alcohol y sustancias",
                                        "Adicción a pantallas y tecnología",
                                        "Juego patológico",
                                        "Adicción a la comida",
                                        "Compras compulsivas",
                                        "Co-dependencia",
                                        "Tabaquismo",
                                        "Adicciones conductuales",
                                    ].map((tag) => (
                                        <span key={tag} className="inline-flex items-center rounded-full border border-indigo-700/40 bg-indigo-900/30 px-3 py-1 text-xs font-medium text-indigo-200 backdrop-blur-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Propuesta de valor */}
                            <ul className="mb-10 space-y-3">
                                {[
                                    "Evaluación diagnóstica integral — psicológica y psicosocial",
                                    "Psicoterapia individual y grupal con enfoque cognitivo-conductual y motivacional",
                                    "Acompañamiento a familias y redes de apoyo",
                                    "Intervención en crisis y prevención de recaídas",
                                    "Derivación coordinada a centros especializados cuando se requiera",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300 sm:text-base">
                                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500/30">
                                            <Check className="h-3 w-3 text-indigo-400" />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <a
                                    href="mailto:centrodereflexionescriticas@gmail.com?subject=Consulta%20Psicolog%C3%ADa%20y%20Adicciones"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-900/50 hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95"
                                >
                                    <Mail className="h-4 w-4" />
                                    Consultar disponibilidad
                                </a>
                                <p className="text-xs text-gray-500">Confidencialidad garantizada · Sin listas de espera prolongadas</p>
                            </div>
                        </motion.div>

                        {/* RIGHT: Tarjetas de enfoque */}
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-60px" }}
                            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12 } } }}
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                        >
                            {[
                                {
                                    title: "Evaluación Diagnóstica",
                                    desc: "Entrevista clínica estructurada, aplicación de instrumentos validados (AUDIT, DAST, CAGE) y elaboración de perfil de consumo para orientar el plan terapéutico.",
                                    icon: "🔍",
                                    accent: "indigo",
                                },
                                {
                                    title: "Psicoterapia Individual",
                                    desc: "Sesiones personalizadas con enfoque cognitivo-conductual, entrevista motivacional y terapia de aceptación y compromiso (ACT).",
                                    icon: "🧠",
                                    accent: "purple",
                                },
                                {
                                    title: "Intervención Familiar",
                                    desc: "Trabajo con el sistema familiar y redes de apoyo para fortalecer vínculos saludables, establecer límites y sostener el proceso de recuperación.",
                                    icon: "👨‍👩‍👧",
                                    accent: "indigo",
                                },
                                {
                                    title: "Prevención de Recaídas",
                                    desc: "Identificación de desencadenantes, desarrollo de estrategias de afrontamiento y plan de acción ante situaciones de riesgo.",
                                    icon: "🛡️",
                                    accent: "purple",
                                },
                                {
                                    title: "Adicciones Conductuales",
                                    desc: "Abordaje especializado de adicciones sin sustancias: tecnología, juego, compras compulsivas y otras conductas que afectan la calidad de vida.",
                                    icon: "📱",
                                    accent: "indigo",
                                },
                                {
                                    title: "Seguimiento y Alta",
                                    desc: "Acompañamiento post-tratamiento con sesiones de mantenimiento, evaluación de logros y criterios clínicos de alta progresiva.",
                                    icon: "🌱",
                                    accent: "purple",
                                },
                            ].map((card, i) => (
                                <motion.div
                                    key={i}
                                    variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                                    className={`group rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${
                                        card.accent === "indigo"
                                            ? "border-indigo-800/40 bg-indigo-950/50 hover:border-indigo-600/60 hover:shadow-lg hover:shadow-indigo-900/40"
                                            : "border-purple-800/40 bg-purple-950/40 hover:border-purple-600/60 hover:shadow-lg hover:shadow-purple-900/40"
                                    }`}
                                >
                                    <div className="mb-3 text-2xl">{card.icon}</div>
                                    <h4 className={`mb-2 text-sm font-bold ${card.accent === "indigo" ? "text-indigo-200" : "text-purple-200"}`}>
                                        {card.title}
                                    </h4>
                                    <p className="text-xs leading-relaxed text-gray-400">{card.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* C·0) Informes Socioocupacionales — DESTACADO */}
            <section id="informes-socioocupacionales" className="relative overflow-hidden bg-white py-16 sm:py-20 border-b border-gray-100">
                {/* Subtle warm gradient wash */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-50/60 via-white to-white" />

                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">

                        {/* LEFT: Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative overflow-hidden rounded-2xl shadow-2xl"
                        >
                            <img
                                src="/images/informes_socioocupacionales.png"
                                alt="Evaluación socioocupacional profesional"
                                className="w-full h-full object-cover"
                                style={{ minHeight: "320px", maxHeight: "480px" }}
                            />
                            {/* Overlay badge */}
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm border border-gray-100">
                                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-xs font-bold text-gray-800 tracking-wide">Disponible · Presencial y Online</span>
                            </div>
                        </motion.div>

                        {/* RIGHT: Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.15 }}
                        >
                            {/* Eyebrow — important indicator */}
                            <div className="mb-5 flex items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-sm">
                                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                                    Servicio Destacado
                                </span>
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Ambos profesionales</span>
                            </div>

                            <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl font-serif leading-snug">
                                Informes Socioocupacionales:<br />
                                <span className="text-amber-600">El documento que cambia el rumbo.</span>
                            </h2>

                            <p className="mb-6 text-sm leading-relaxed text-gray-600 sm:text-base">
                                Cuando la vida de una persona —o su futuro— depende de una decisión técnica, la calidad del informe lo es todo.
                                Juan Carlos Rauld y Rocío Solar elaboran <strong className="text-gray-900">informes socioocupacionales de alto estándar</strong> que son reconocidos por instituciones, tribunales y organizaciones: documentos que no solo describen, sino que <em>convencen con evidencia</em>.
                            </p>

                            {/* Population coverage */}
                            <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {[
                                    { label: "Niños", desc: "Desde primera infancia", icon: "🧒" },
                                    { label: "Adolescentes", desc: "Contexto escolar y familiar", icon: "👦" },
                                    { label: "Adultos", desc: "Evaluación funcional y laboral", icon: "🧑" },
                                    { label: "Organizaciones", desc: "Diagnóstico institucional", icon: "🏛️" },
                                ].map((item) => (
                                    <div key={item.label} className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center shadow-sm hover:border-amber-200 hover:bg-amber-50/40 transition-colors">
                                        <div className="text-xl mb-1">{item.icon}</div>
                                        <p className="text-xs font-bold text-gray-900">{item.label}</p>
                                        <p className="mt-0.5 text-[10px] text-gray-500 leading-tight">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Value props list */}
                            <ul className="mb-7 space-y-2.5">
                                {[
                                    "Redacción técnica con respaldo clínico y normativo",
                                    "Validez ante organismos judiciales, educativos y laborales",
                                    "Entregado en plazos definidos — claridad cuando más se necesita",
                                    "Firmado por profesionales habilitados con trayectoria acreditada",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <a
                                    href="mailto:centrodereflexionescriticas@gmail.com?subject=Solicitud%20Informe%20Socioocupacional"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-amber-600 transition-all hover:scale-105 active:scale-95"
                                >
                                    <Mail className="h-4 w-4" />
                                    Solicitar Informe
                                </a>
                                <p className="text-xs text-gray-400">Respondemos en menos de 24 horas hábiles.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* B·5) Equipo Multidisciplinario — Nueva Sección */}
            <section id="equipo-multidisciplinario" className="relative overflow-hidden bg-white py-16 sm:py-24 border-b border-gray-100">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30" />
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="mb-14 text-center"
                    >
                        <span className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-blue-700 ring-1 ring-inset ring-blue-100">
                            Equipo Multidisciplinario
                        </span>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl font-serif">
                            Una consultora de múltiples miradas
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl text-base text-gray-500 sm:text-lg leading-relaxed">
                            Cada problema social es complejo. Por eso articulamos profesionales de distintas disciplinas para entregar soluciones con profundidad técnica, rigor científico y pertinencia social.
                        </p>
                    </motion.div>

                    {/* Grid de especialistas */}
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {[
                            {
                                icon: Brain,
                                color: "blue",
                                title: "Trabajo Social y Salud Mental",
                                desc: "Núcleo fundacional del CRC. Intervención clínica especializada en infancia, familia y comunidad. Evaluación de riesgo psicosocial, diseño de modelos de intervención y políticas basadas en evidencia.",
                                tags: ["Evaluación pericial", "Programas sociales", "Infancia y familia"],
                            },
                            {
                                icon: HeartHandshake,
                                color: "purple",
                                title: "Terapia Ocupacional",
                                desc: "Intervención centrada en la funcionalidad, el bienestar y los derechos humanos. Evaluación e intervención en salud mental infanto-juvenil, inclusión educativa y contextos comunitarios.",
                                tags: ["PIE / Inclusión", "Salud mental", "Derechos humanos"],
                            },
                            {
                                icon: Scale,
                                color: "amber",
                                title: "Derecho y Ciencias Jurídicas",
                                desc: "Asesoría legal especializada en derecho de familia, infancia y protección de derechos. Apoyo técnico en procedimientos judiciales, tutela de derechos y normativa de protección social.",
                                tags: ["Derecho de familia", "Protección derechos", "Asesoría normativa"],
                            },
                            {
                                icon: GraduationCap,
                                color: "emerald",
                                title: "Sociología y Ciencias Sociales",
                                desc: "Análisis sociológico de fenómenos sociales complejos, investigación cualitativa y cuantitativa, diagnósticos territoriales y estudios sobre desigualdad, vulnerabilidad y exclusión social.",
                                tags: ["Diagnóstico social", "Investigación", "Análisis territorial"],
                            },
                            {
                                icon: TrendingUp,
                                color: "rose",
                                title: "Ingeniería Comercial y Gestión",
                                desc: "Planificación estratégica, arquitectura organizacional y diseño de indicadores de desempeño para organizaciones sociales. Modelos de gestión que alinean eficiencia operativa con impacto social medible.",
                                tags: ["Gestión estratégica", "KPIs de impacto", "Modelos organizacionales"],
                            },
                            {
                                icon: Building2,
                                color: "slate",
                                title: "Política Pública e Institucional",
                                desc: "Acompañamiento a organismos públicos y privados en diseño, implementación y evaluación de políticas y programas sociales. Fortalecimiento institucional, gobernanza y mejora continua.",
                                tags: ["Políticas públicas", "Evaluación de programas", "Gobernanza"],
                            },
                        ].map((spec, idx) => {
                            const Icon = spec.icon;
                            const colorMap: Record<string, string> = {
                                blue: "bg-blue-50 text-blue-600 ring-blue-100 hover:shadow-blue-100/60",
                                purple: "bg-purple-50 text-purple-600 ring-purple-100 hover:shadow-purple-100/60",
                                amber: "bg-amber-50 text-amber-600 ring-amber-100 hover:shadow-amber-100/60",
                                emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100 hover:shadow-emerald-100/60",
                                rose: "bg-rose-50 text-rose-600 ring-rose-100 hover:shadow-rose-100/60",
                                slate: "bg-slate-50 text-slate-600 ring-slate-100 hover:shadow-slate-100/60",
                            };
                            const iconBg: Record<string, string> = {
                                blue: "bg-blue-100 text-blue-600",
                                purple: "bg-purple-100 text-purple-600",
                                amber: "bg-amber-100 text-amber-600",
                                emerald: "bg-emerald-100 text-emerald-600",
                                rose: "bg-rose-100 text-rose-600",
                                slate: "bg-slate-100 text-slate-600",
                            };
                            const tagBg: Record<string, string> = {
                                blue: "bg-blue-50 text-blue-700 ring-blue-200/50",
                                purple: "bg-purple-50 text-purple-700 ring-purple-200/50",
                                amber: "bg-amber-50 text-amber-700 ring-amber-200/50",
                                emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200/50",
                                rose: "bg-rose-50 text-rose-700 ring-rose-200/50",
                                slate: "bg-slate-50 text-slate-700 ring-slate-200/50",
                            };
                            return (
                                <motion.div
                                    key={idx}
                                    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                                    className={`group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ring-1 ${colorMap[spec.color]}`}
                                >
                                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${iconBg[spec.color]}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-3 text-lg font-bold text-gray-900 font-serif leading-tight">{spec.title}</h3>
                                    <p className="mb-5 flex-grow text-sm leading-relaxed text-gray-500">{spec.desc}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {spec.tags.map((tag) => (
                                            <span key={tag} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${tagBg[spec.color]}`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-14 flex flex-col items-center gap-4 text-center"
                    >
                        <p className="text-sm text-gray-500 max-w-lg">
                            ¿Tu desafío requiere una mirada multidisciplinaria? Armamos el equipo a medida para tu organización.
                        </p>
                        <a
                            href="mailto:centrodereflexionescriticas@gmail.com?subject=Consulta%20Equipo%20Multidisciplinario"
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-gray-700 transition-all hover:scale-105 active:scale-95"
                        >
                            <Mail className="h-4 w-4" />
                            Armar equipo a medida
                        </a>
                    </motion.div>
                </div>
            </section>

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
                            <h3 className="text-2xl font-bold text-white mb-2 font-serif">
                                Formación — <span className="text-blue-400">Juan Carlos Rauld</span>
                            </h3>
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-8">
                                <p className="text-zinc-500 text-sm">
                                    Trabajador Social · Mg. Pensamiento Contemporáneo (UDP) · Doctorando Trabajo Social, Universitat Rovira i Virgili, España
                                </p>
                                <a href="#recomendaciones-linkedin" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-300 transition-colors whitespace-nowrap">
                                    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                    11 recomendaciones en LinkedIn →
                                </a>
                            </div>
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
                                <h3 className="text-2xl font-bold text-white mb-2 font-serif">
                                    Formación — <span className="text-purple-400">Rocío Solar</span>
                                </h3>
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-8">
                                    <p className="text-zinc-500 text-sm">
                                        Terapeuta Ocupacional · Mg. en Ocupación y T.O. (U. de Chile) · Especialista en TEA, Salud Mental Comunitaria y Género
                                    </p>
                                    <a href="#recomendaciones-linkedin" className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors whitespace-nowrap">
                                        <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                        3 recomendaciones en LinkedIn →
                                    </a>
                                </div>
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

            {/* F) Recomendaciones LinkedIn — Fundadores */}
            <LinkedInRecommendations />

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

// ─────────────────────────────────────────────
// Componente: Recomendaciones LinkedIn
// ─────────────────────────────────────────────

const LinkedInIcon = () => (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const jcrRecommendations = [
    {
        name: "Sofía Aliaga Bustos",
        title: "Periodista · Políticas Públicas de Niñez e Incidencia",
        date: "Diciembre 2025",
        relation: "Colega en distintas empresas",
        initials: "SA",
        color: "from-blue-600 to-blue-800",
        featured: true,
        text: "Tuve la oportunidad de trabajar con Juan Carlos cuando se desempeñaba como coordinador del programa Red Calle Niños, instancia en la que pude conocer a un profesional de altísimo nivel técnico y conceptual. Es trabajador social, con una sólida trayectoria en infancia, salud mental y políticas públicas, y un marcado perfil académico, que combina pensamiento crítico, rigurosidad metodológica y profundo conocimiento teórico. Juan Carlos destaca por su calidad humana, su cercanía en el trabajo cotidiano y su profundo compromiso con los niños y niñas, demostrando una capacidad poco común para comprender sus trayectorias de vida, leer la complejidad de sus historias y traducirlas en intervenciones respetuosas, pertinentes y éticamente cuidadas. Es un profesional serio, generoso en el trabajo colaborativo y con una fuerte convicción por la protección de derechos. Por su trayectoria, liderazgo técnico y capacidad de gestión, tiene un perfil especialmente sólido para roles de coordinación, dirección de proyectos y conducción de equipos en contextos complejos.",
    },
    {
        name: "Juan Pablo Venegas Gormaz",
        title: "Gerente de Incidencia en Políticas Públicas · World Vision Chile",
        date: "Enero 2026",
        relation: "Cargo superior",
        initials: "JP",
        color: "from-green-600 to-green-800",
        featured: false,
        text: "He tenido la oportunidad de colaborar con Juan Carlos en múltiples roles y puedo confirmar que es un profesional que cuenta con competencias probadas de liderazgo y coordinación de equipos para la gestión de programas de intervención con NNA. Su perfil mezcla habilidades de intervención y manejo teórico para el trabajo social, para la intervención especializada en salud mental infantil y en especial ante población con daño severo y trauma. Su trayectoria académica y publicaciones confirman su versatilidad profesional. Trabajar con él ha sido garantía de responsabilidad en la gestión de recursos y de una solidez técnica para garantizar las mejores condiciones de atención de niños, niñas y adolescentes.",
    },
    {
        name: "Paulina González Geisse",
        title: "Psicóloga Clínica · Doctorante en Violencias Conyugales",
        date: "Enero 2026",
        relation: "Supervisora directa",
        initials: "PG",
        color: "from-purple-600 to-purple-800",
        featured: false,
        text: "Tuve el gusto de trabajar con Juan Carlos en el Programa de Reparación de Maltrato Grave (PRM) de La Cisterna, donde se desempeñó como director (s) y asistente social. Destaco especialmente su capacidad de análisis, su liderazgo cercano y su profunda vocación por el trabajo social. Juan Carlos combina una sólida capacidad técnica con una gran calidad humana. Supo orientar al equipo con claridad, fomentar el trabajo colaborativo y tomar decisiones fundamentadas, incluso en contextos complejos y de alta exigencia emocional. Recomiendo plenamente a Juan Carlos Rauld Farías por su seriedad, responsabilidad y auténtico compromiso con el bienestar social.",
    },
    {
        name: "Carlos Luis Barría Román",
        title: "Rector · Universidad UNIACC",
        date: "Enero 2026",
        relation: "Colaboración académica",
        initials: "CB",
        color: "from-amber-600 to-amber-800",
        featured: false,
        text: "Juan Carlos Rauld es un profesional comprometido con el estudio de la infancia. Nos conocimos cuando estudié de cerca su trabajo como editor y coautor del libro "Perspectivas críticas de la salud mental infantil: Trauma, institucionalización y suplicio". A través de su libro, pude conocer también su trabajo en el Hospital Luis Calvo Mackenna, además de su perspectiva en torno a la salud pública y el sufrimiento psíquico en los procesos de intervención y hospitalización de salud mental. Me parece un gran profesional. Serio, metódico y muy comprometido con la infancia desde las disciplinas que cultiva.",
    },
    {
        name: "Fernanda Gumucio Dobbs",
        title: "Directora · Subjetivamente | Psicología, Magíster U. de Chile",
        date: "Diciembre 2025",
        relation: "Cargo superior",
        initials: "FG",
        color: "from-rose-600 to-rose-800",
        featured: false,
        text: "Conocí el trabajo de Juan Carlos Rauld Farías en espacios profesionales vinculados a infancia y salud mental, donde destaca por una mirada crítica sólida y un compromiso serio con el análisis ético y político de la intervención psicosocial. Su capacidad para articular práctica, reflexión teórica y lectura institucional lo convierte en un profesional consistente, especialmente valioso en contextos complejos y de alta exigencia. Es un aporte claro para equipos académicos, de investigación o intervención.",
    },
    {
        name: "Carmen Lamilla Almuna",
        title: "Directora de Carrera · Universidad Andrés Bello",
        date: "Febrero 2026",
        relation: "Supervisora directa",
        initials: "CL",
        color: "from-teal-600 to-teal-800",
        featured: false,
        text: "Trabajé con Juan Carlos en Universidad Andrés Bello, donde destacó su flexibilidad, trabajo en equipo, responsabilidad y capacidad para integrar los elementos teóricos con lo práctico. Su experiencia profesional y actualización constante lo hacen una persona con alta capacidad de gestión capaz de integrarse en diferentes proyectos y desafíos.",
    },
    {
        name: "Leonardo Gálvez",
        title: "Psicólogo Jurídico · Especialista Psicodiagnóstico UC · Terapeuta Infanto-Juvenil",
        date: "Enero 2026",
        relation: "Supervisor directo",
        initials: "LG",
        color: "from-indigo-600 to-indigo-800",
        featured: false,
        text: "Es un profesional metódico y responsable. Muy preocupado del trabajo técnico y de la actualización de conocimientos tanto propios como de la formación de equipos. Con capacidad para organizar y gestionar actividades que integran el trabajo profesional y académico desde la vinculación con el medio. Destaca principalmente su capacidad para sistematizar experiencias y realizar diagnósticos que propician los ajustes que pueda requerir un proyecto, programa o contexto en el que se desenvuelva.",
    },
    {
        name: "Gabriel Guzmán Riquelme",
        title: "Defensor de Derechos Humanos de Niñas, Niños y Adolescentes",
        date: "Enero 2026",
        relation: "Colega en distintas empresas",
        initials: "GG",
        color: "from-cyan-600 to-cyan-800",
        featured: false,
        text: "Juan Carlos es tremendo profesional. Se compromete y reflexiona a fondo de las cosas y de su quehacer, combinando reflexión activa y acción. 1000 recomendado.",
    },
    {
        name: "Rocío Solar Guerra",
        title: "Co-Fundadora CRC · Terapeuta Ocupacional | Salud Mental Comunitaria",
        date: "Diciembre 2025",
        relation: "Supervisada directa",
        initials: "RS",
        color: "from-violet-600 to-violet-800",
        featured: false,
        text: "Tuve la oportunidad de trabajar con Juan Carlos Rauld Farías en su rol como Coordinador Regional del Proyecto Red Calle Niños. Juan Carlos es un líder cercano, respetuoso y comprometido, que sabe guiar a los equipos desde la confianza, la claridad de objetivos y el buen trato. Se caracteriza por su capacidad para tomar decisiones informadas, su mirada estratégica y su genuino interés por el desarrollo profesional de las personas con las que trabaja. Siempre promovió un ambiente laboral colaborativo, facilitando espacios de aprendizaje, retroalimentación y mejora continua. Sin duda, recomiendo a Juan Carlos como un profesional íntegro, confiable y con sólidas habilidades de liderazgo.",
    },
    {
        name: "Rodrigo Fernando Goycolea Martinic",
        title: "Investigador y Clínico",
        date: "Enero 2026",
        relation: "Mismo equipo",
        initials: "RG",
        color: "from-slate-600 to-slate-700",
        featured: false,
        text: "Excelente profesional muy comprometido con su trabajo, una persona de confianza y muy perseverante para lograr los objetivos propuestos. Excelente colega para trabajar en equipo.",
    },
    {
        name: "Rocío Montecino Mella",
        title: "Terapeuta Ocupacional · Especialista en Niñeces y Adolescencias",
        date: "Enero 2026",
        relation: "Mismo equipo",
        initials: "RM",
        color: "from-pink-600 to-pink-800",
        featured: false,
        text: "Muy buen profesional en relación al cuidado de niños, niñas y adolescentes.",
    },
];

const rocioRecommendations = [
    {
        name: "Fabiola Andrea Cofian Cares",
        title: "Trabajadora Social · Máster en Estudios de Mujeres, Género y Ciudadanía",
        date: "Diciembre 2025",
        relation: "Mismo equipo",
        initials: "FC",
        color: "from-purple-600 to-purple-800",
        featured: true,
        text: "Tuve la oportunidad de trabajar con Rocío en el Programa RAIF de la Fundación San Carlos de Maipo. Rocío se caracteriza por un ejercicio de acompañamiento riguroso, respetuoso y comprometido con las personas con quienes trabaja, logrando procesos de cambio significativos y sostenidos en el tiempo. Su trabajo se distingue por una sólida base técnica, un alto nivel de organización y una metodología meticulosa, siempre orientada a fortalecer la autonomía y las capacidades de las personas acompañadas. Rocío es una profesional que aporta de manera generosa a los equipos, ofreciendo apoyo, reflexiones técnicas y herramientas que enriquecen el quehacer colectivo. Es una profesional confiable y ética, así como una excelente compañera de equipo, cuyo aporte resulta valioso tanto a nivel humano como profesional.",
    },
    {
        name: "Juan Carlos Rauld Farías",
        title: "Co-Fundador CRC · Doctorando Trabajo Social · Universitat Rovira i Virgili",
        date: "Diciembre 2025",
        relation: "Supervisor directo",
        initials: "JCR",
        color: "from-amber-600 to-amber-800",
        featured: false,
        text: "Otorgo mi total recomendación a Rocío Solar. Trabajamos juntos en el Proyecto Red Calle Niños, donde fui su jefatura directa. En Rocío destacan habilidades clínicas y técnicas de dirección y coordinación de equipos. En su quehacer profesional, advertí fuertes habilidades clínicas de intervención de salud mental infantil en contextos de altísimo riesgo psicosocial. Además de su formación y desempeño riguroso, destacan en ella competencias de trabajo bajo presión y un fuerte compromiso orientado al cumplimiento de tareas y responsabilidades organizacionales. En suma, una excelente profesional.",
    },
    {
        name: "Sofía Aliaga Bustos",
        title: "Periodista · Coordinación Intersectorial y Políticas Públicas de Niñez",
        date: "Diciembre 2025",
        relation: "Asesora",
        initials: "SA",
        color: "from-blue-600 to-blue-800",
        featured: false,
        text: "Tuve la oportunidad de coincidir con Rocío en su rol como contraparte en el programa Red Calle Niños. Encontré en ella a una profesional con sólida formación en terapia ocupacional, un claro enfoque en salud mental y una experiencia relevante en niñez y adolescencia. Destaca por su criterio técnico, su mirada integral y su capacidad para articular intervenciones pertinentes en contextos complejos. Es una profesional rigurosa, responsable y con una muy buena disposición al trabajo colaborativo e intersectorial.",
    },
];

function RecommendationCard({ rec, index }: { rec: typeof jcrRecommendations[0], index: number }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = rec.text.length > 280;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: index * 0.07 }}
            className={`group relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 ${
                rec.featured
                    ? "border-white/20 bg-white/10 shadow-lg shadow-black/20"
                    : "border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/15"
            }`}
        >
            {/* LinkedIn watermark */}
            <div className="absolute top-5 right-5 text-white/20 group-hover:text-white/40 transition-colors">
                <LinkedInIcon />
            </div>

            {/* Quote mark */}
            <div className="mb-3 text-4xl font-serif leading-none text-white/15 select-none">"</div>

            {/* Text */}
            <p className={`mb-5 flex-1 text-sm leading-relaxed text-slate-300 ${!expanded && isLong ? "line-clamp-4" : ""}`}>
                {rec.text}
            </p>
            {isLong && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mb-5 -mt-2 w-fit text-xs font-semibold text-white/40 hover:text-white/70 transition-colors"
                >
                    {expanded ? "— leer menos" : "leer más →"}
                </button>
            )}

            {/* Author */}
            <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${rec.color} text-[11px] font-bold text-white shadow-inner`}>
                    {rec.initials}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{rec.name}</p>
                    <p className="truncate text-xs text-slate-400 mt-0.5">{rec.title}</p>
                </div>
            </div>

            {/* Meta */}
            <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500">
                <span>{rec.date}</span>
                <span>·</span>
                <span>{rec.relation}</span>
            </div>
        </motion.div>
    );
}

function LinkedInRecommendations() {
    const [activeTab, setActiveTab] = useState<"jcr" | "rocio">("jcr");

    const recs = activeTab === "jcr" ? jcrRecommendations : rocioRecommendations;
    const featured = recs[0];
    const rest = recs.slice(1);

    const jcrProfile = "https://www.linkedin.com/in/juan-carlos-rauld-farias-a64710a4/";
    const rocioProfile = "https://www.linkedin.com/in/roc%C3%ADo-solar-guerra-168693138/";

    return (
        <section id="recomendaciones-linkedin" className="relative overflow-hidden bg-slate-900 py-20 sm:py-28 lg:py-36">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute left-1/4 top-0 -z-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/5 blur-[140px]" />
            <div className="pointer-events-none absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-600/5 blur-[140px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-12 text-center"
                >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 backdrop-blur-sm">
                        <LinkedInIcon />
                        <span>Recomendaciones Verificadas en LinkedIn</span>
                    </div>
                    <h2 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl font-serif">
                        Lo que dicen quienes{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-400 to-indigo-400">
                            han trabajado con ellos
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-base font-light text-slate-400 sm:text-lg">
                        Referencias reales de colegas, supervisores y colaboradores — publicadas en sus perfiles oficiales de LinkedIn.
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="mb-10 flex justify-center">
                    <div className="inline-flex gap-1 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-sm">
                        {[
                            { key: "jcr", label: "Juan Carlos Rauld", count: jcrRecommendations.length, href: jcrProfile },
                            { key: "rocio", label: "Rocío Solar", count: rocioRecommendations.length, href: rocioProfile },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as "jcr" | "rocio")}
                                className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                                    activeTab === tab.key
                                        ? "bg-white text-slate-900 shadow-lg"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {tab.label}
                                <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold transition-colors ${
                                    activeTab === tab.key ? "bg-blue-600 text-white" : "bg-white/10 text-slate-400"
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* LinkedIn profile link */}
                <div className="mb-10 text-center">
                    <a
                        href={activeTab === "jcr" ? jcrProfile : rocioProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <LinkedInIcon />
                        Ver perfil completo en LinkedIn
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                </div>

                {/* Featured card + grid */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Featured */}
                    <div className="mb-6 rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-7 sm:p-9 backdrop-blur-md shadow-xl shadow-black/20">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-400">
                                ★ Destacada
                            </span>
                        </div>
                        <div className="mb-5 text-4xl font-serif text-white/20 select-none leading-none">"</div>
                        <p className="mb-6 text-base font-light leading-relaxed text-slate-200 sm:text-lg">
                            {featured.text}
                        </p>
                        <div className="flex items-center gap-4 border-t border-white/10 pt-5">
                            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${featured.color} text-sm font-bold text-white shadow-inner`}>
                                {featured.initials}
                            </div>
                            <div>
                                <p className="font-semibold text-white">{featured.name}</p>
                                <p className="text-sm text-slate-400">{featured.title}</p>
                                <p className="mt-1 text-[11px] text-slate-500">{featured.date} · {featured.relation}</p>
                            </div>
                            <div className="ml-auto hidden sm:block text-white/20">
                                <LinkedInIcon />
                            </div>
                        </div>
                    </div>

                    {/* Rest of recommendations grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {rest.map((rec, i) => (
                            <RecommendationCard key={rec.name} rec={rec} index={i} />
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
