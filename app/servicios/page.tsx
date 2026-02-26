"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Check, ArrowRight, PenTool, Users, Building2, Mail, Brain, HeartHandshake, Rocket } from "lucide-react";

export default function Services() {
    const [activePillar, setActivePillar] = useState<number>(0);

    const consultingPillars = [
        {
            id: "clinico",
            title: "Diseño Clínico",
            icon: Brain,
            description: "Liderado por Juan Carlos Rauld. Diagnosticamos y diseñamos la arquitectura clínica de tu programa. No dejamos espacio al azar: construimos estándares basados en evidencia para asegurar resultados irreprochables.",
            bgImage: "/images/pillar_clinico.png",
        },
        {
            id: "territorio",
            title: "Territorio e Inclusión",
            icon: HeartHandshake,
            description: "Liderado por Rocío Solar. La estrategia debe sobrevivir al mundo real. Desplegamos intervenciones orgánicas, asegurando que el diseño de escritorio se convierta en bienestar tangible en las comunidades.",
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
            <div className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl font-serif"
                    >
                        Nuestros Servicios
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto"
                    >
                        <p>
                            Una oferta integral que combina la <strong>atención clínica especializada</strong>,
                            la <strong>formación académica</strong> y la <strong>consultoría estratégica</strong> para instituciones.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* A) Consultoría Estratégica (The "Umbrella" Offer) */}
            <section id="consultoria" className="relative py-32 bg-slate-900 border-b border-slate-800 overflow-hidden">
                {/* Abstract Background Assets */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-3/4 h-full opacity-20 mix-blend-overlay">
                        {/* We use the abstract network image here as a subtle background texture */}
                        <div className="relative w-full h-full">
                            <img src="/images/consulting_hero.png" alt="Abstract Network" className="object-cover w-full h-full" />
                            <div className="absolute inset-0 bg-slate-900/40"></div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">

                        {/* Left Column: Strategic Vision */}
                        <div className="lg:col-span-5 mb-16 lg:mb-0">
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
                                    className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-transparent text-amber-500 text-xs font-bold border border-amber-500/20 tracking-[0.2em] uppercase mb-8 shadow-[0_0_15px_rgba(245,158,11,0.1)] backdrop-blur-md"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse"></div>
                                    Consultoría Integral CRC
                                </motion.span>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-8 font-serif leading-[1.1]">
                                    Elevemos el <br />
                                    Estándar del <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-sm">
                                        Impacto Social
                                    </span>
                                </h2>
                                <p className="text-lg text-slate-300 leading-relaxed mb-12 font-light border-l-2 border-amber-500/40 pl-6 lg:pl-8 max-w-xl">
                                    Las grandes transformaciones no se sostienen con buenas intenciones ni hojas de cálculo. Unimos nuestra profunda experiencia clínica y comunitaria con la precisión tecnológica de <strong>Altius Ignite</strong>.<br /><br />
                                    El resultado: diseños psicosociales de alto nivel, ejecutados y medidos con impecabilidad de software. Así garantizamos que tu institución deje un legado real.
                                </p>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-block"
                                >
                                    <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-10 py-7 rounded-lg shadow-[0_0_40px_rgba(245,158,11,0.3)] transition-all duration-300 border-none group">
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
                            className="lg:col-span-7 relative"
                        >
                            {/* Ambient subtle glow behind the cards */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

                            <div className="flex flex-col md:flex-row h-[750px] md:h-[600px] w-full gap-4">
                                {consultingPillars.map((pillar, idx) => {
                                    const isActive = activePillar === idx;
                                    const Icon = pillar.icon;

                                    return (
                                        <motion.div
                                            key={pillar.id}
                                            onClick={() => setActivePillar(idx)}
                                            className={`relative overflow-hidden rounded-2xl cursor-pointer transition-[flex-grow,width] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex ${isActive ? "flex-grow md:w-[70%] lg:w-[76%] bg-amber-500/10 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)]" : "md:w-[15%] lg:w-[12%] bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/50"} border backdrop-blur-md group`}
                                            layout
                                        >
                                            {/* Background Image (only visible if active) */}
                                            <div className={`absolute inset-0 transition-opacity duration-700 ${isActive ? "opacity-40" : "opacity-0"}`}>
                                                <img src={pillar.bgImage} className="w-full h-full object-cover mix-blend-overlay" />
                                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
                                            </div>

                                            <div className={`relative z-10 flex ${isActive ? "flex-col p-6 lg:p-8 justify-end h-full" : "flex-row items-center md:flex-col md:justify-center p-4"} w-full`}>

                                                {/* Inactive Icon & Vertical Title / Active Top Logo */}
                                                <div className={`flex items-center justify-center transition-all ${isActive ? "absolute top-6 left-6 md:top-8 md:left-8" : "md:h-full md:flex-col"}`}>
                                                    <div className={`flex items-center justify-center rounded-xl bg-slate-900/50 border shadow-inner transition-all duration-500 ${isActive ? "w-16 h-16 border-amber-500/50" : "w-12 h-12 border-slate-700 group-hover:border-amber-500/30"}`}>
                                                        <Icon className={`transition-all duration-500 ${isActive ? "w-8 h-8 text-amber-500" : "w-6 h-6 text-slate-400 group-hover:text-amber-500"}`} />
                                                    </div>

                                                    {/* Title text rotated on desktop inactive */}
                                                    {!isActive && (
                                                        <span className="ml-4 md:ml-0 md:mt-8 font-serif font-bold text-slate-300 md:-rotate-180 md:[writing-mode:vertical-rl] whitespace-nowrap tracking-wider group-hover:text-amber-400 transition-colors">
                                                            {pillar.title}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Active Content */}
                                                <div className={`flex flex-col transition-all duration-700 delay-150 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 hidden"}`}>
                                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 font-serif leading-tight">{pillar.title}</h3>
                                                    <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-8 font-light max-w-xl">{pillar.description}</p>
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
            <section id="clinica" className="py-24 bg-white border-b border-gray-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-6">
                                Dirección Clínica
                            </span>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6 font-serif">
                                Evaluación Psicosocial
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
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
                                    <li key={idx} className="flex items-start justify-between border-b border-gray-100 pb-2 group hover:bg-gray-50/50 transition-colors rounded-lg px-2 -mx-2">
                                        <div className="flex items-center text-gray-700">
                                            <Check className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                            <span className="group-hover:text-blue-900 transition-colors">{item.name}</span>
                                        </div>
                                        <span className="font-semibold text-gray-900 text-sm ml-4">{item.price}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                                Solicitar Evaluación
                            </Button>
                        </div>
                        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
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
            < section id="terapia-ocupacional" className="py-24 bg-gray-50 border-b border-gray-100" >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-last lg:order-first relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
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
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6 font-serif">
                                Intervención Comunitaria y Clínica
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
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
            < section id="formacion" className="py-24 bg-white relative overflow-hidden" >
                {/* Widescreen Backgrounds */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] md:w-[700px] md:h-[700px] lg:w-[1000px] lg:h-[1000px] -z-0 opacity-[0.25] md:opacity-[0.35] lg:opacity-[0.45] pointer-events-none">
                    <img
                        src="/images/juan_carlos_20260224.png"
                        alt=""
                        className="w-full h-full object-cover object-top filter"
                        style={{ WebkitMaskImage: "radial-gradient(ellipse at top right, black 25%, transparent 75%)", maskImage: "radial-gradient(ellipse at top right, black 25%, transparent 75%)" }}
                    />
                </div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] md:w-[700px] md:h-[700px] lg:w-[1000px] lg:h-[1000px] -z-0 opacity-[0.25] md:opacity-[0.35] lg:opacity-[0.45] pointer-events-none">
                    <img
                        src="/images/rocio_solar.png"
                        alt=""
                        className="w-full h-full object-cover object-top filter"
                        style={{ WebkitMaskImage: "radial-gradient(ellipse at bottom left, black 25%, transparent 75%)", maskImage: "radial-gradient(ellipse at bottom left, black 25%, transparent 75%)" }}
                    />
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-700/10 mb-4">Servicios</span>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-2 font-serif">Formación y Capacitación</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            Instancias de aprendizaje para equipos profesionales, comunidades educativas y organizaciones.
                        </p>
                        <p className="mt-2 text-sm text-gray-400 italic">
                            * Los precios indicados son referenciales y están sujetos a confirmación.
                        </p>
                    </div>

                    {/* Juan Carlos Rauld - Formación */}
                    <div className="mb-24 relative">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 font-serif border-b border-gray-200 pb-4">
                                Formación — <span className="text-blue-600">Juan Carlos Rauld</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { name: "Capacitación en Intervención de Crisis", price: "Desde 5 UF", detail: "Modalidad presencial / online · 4-8 hrs" },
                                    { name: "Supervisión Clínica de Casos", price: "2.5 UF / Sesión", detail: "Para equipos de protección infantil" },
                                    { name: "Formación en Gestión de Programas Sociales", price: "Desde 8 UF", detail: "Incluye material y certificación" },
                                    { name: "Taller de Evaluación Pericial", price: "Desde 6 UF", detail: "Competencias parentales y riesgo" },
                                    { name: "Asesoría Estratégica Institucional", price: "A cotizar", detail: "Diseño de modelos de intervención" },
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-transparent hover:border-blue-200 group">
                                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{item.name}</h4>
                                        <p className="text-sm text-gray-500 mb-4">{item.detail}</p>
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{item.price} *</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Rocío Solar - Formación */}
                        <div className="mb-16 relative">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-gray-900 mb-8 font-serif border-b border-gray-200 pb-4">
                                    Formación — <span className="text-purple-600">Rocío Solar</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        { name: "Charlas en Salud Mental y Género", price: "Consultar", detail: "Presencial / Online · 60-90 min" },
                                        { name: "Formación de Equipos en VIF", price: "Consultar", detail: "Certificado de participación incluido" },
                                        { name: "Asesorías PIE", price: "Plan mensual", detail: "Supervisión reflexiva para Programas de Integración Escolar" },
                                        { name: "Taller de Terapia Ocupacional Comunitaria", price: "Consultar", detail: "Enfoque de Derechos Humanos" },
                                        { name: "Capacitación en Acompañamiento en Terreno", price: "Consultar", detail: "Para equipos de salud mental comunitaria" },
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-gray-50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-transparent hover:border-purple-200 group">
                                            <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">{item.name}</h4>
                                            <p className="text-sm text-gray-500 mb-4">{item.detail}</p>
                                            <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-sm font-semibold text-purple-700">{item.price} *</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact CTA */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 sm:p-12 text-center">
                        <h3 className="text-2xl font-bold text-white mb-4 font-serif">¿Necesitas algo más específico?</h3>
                        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                            Si requieres una formación personalizada o tienes consultas sobre nuestras prestaciones,
                            escríbenos directamente.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="mailto:centrodereflexionescriticas@gmail.com" className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-red-500/25">
                                <Mail className="w-5 h-5 mr-2" />
                                Escribir por Email
                            </a>
                            <span className="text-gray-400 text-sm">o utiliza nuestro asistente virtual</span>
                        </div>
                    </div>
                </div>
            </section >

            {/* D) Alianza Estratégica Institucional (Altius Ignite + CRC) */}
            < section id="alianza-tecnologica" className="relative py-32 overflow-hidden bg-zinc-950 border-t border-zinc-900 border-b border-slate-800" >
                {/* Parallax Background */}
                < div className="absolute inset-0 z-0" >
                    <div
                        className="absolute inset-0 opacity-15 bg-[url('/images/consulting_hero.png')] bg-cover bg-center bg-fixed mix-blend-luminosity"
                        style={{ backgroundAttachment: 'fixed' }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 via-zinc-950/70 to-zinc-900/90 mix-blend-multiply"></div>
                </div >

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:grid lg:grid-cols-12 gap-16 items-center">

                        {/* Left Column: Context & Synergy */}
                        <div className="lg:col-span-5 mb-16 lg:mb-0">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center mb-8">
                                    <div className="relative h-20 w-48 shrink-0">
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
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 font-serif leading-tight">
                                    Ciencias Sociales <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-white to-zinc-400">
                                        Potenciadas por Tecnología
                                    </span>
                                </h2>
                                <p className="text-lg text-zinc-400 leading-relaxed mb-8 font-light border-l-2 border-zinc-700 pl-6">
                                    Llevamos nuestras metodologías al siguiente nivel. Gracias a nuestra alianza estratégica con <strong>Altius Ignite</strong>, combinamos la profundidad analítica de las ciencias sociales con software a medida y plataformas avanzadas para multiplicar tu impacto operativo.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a href="https://www.altiusignite.com" target="_blank" rel="noopener noreferrer">
                                        <Button size="lg" className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold px-8 py-6 rounded-none shadow-xl transition-all hover:scale-105">
                                            Conoce Altius Ignite
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </a>
                                    <a href="/contacto">
                                        <Button variant="outline" size="lg" className="border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800/50 px-8 py-6 rounded-none backdrop-blur-sm -z-0">
                                            Coordinar Evaluación Conjunta
                                        </Button>
                                    </a>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column: Value Props */}
                        <div className="lg:col-span-7">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
                                    className="md:col-span-2 bg-gradient-to-r from-zinc-900 border border-zinc-800 p-8 flex flex-col sm:flex-row items-center justify-between group overflow-hidden relative"
                                >
                                    <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-zinc-800/20 to-transparent pointer-events-none"></div>
                                    <div className="mb-6 sm:mb-0 max-w-lg z-10">
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



        </div >
    );
}
