"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Check, ArrowRight, PenTool, Users, Building2, Mail } from "lucide-react";

export default function Services() {
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
            </section>

            {/* B) Atención Clínica Rocío Solar */}
            <section id="terapia-ocupacional" className="py-24 bg-gray-50 border-b border-gray-100">
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
            </section>

            {/* C) Servicios de Formación */}
            <section id="formacion" className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                    <div className="mb-16">
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
                    <div className="mb-16">
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
            </section>

            {/* D) Consultoría Estratégica (Premium High-End Redesign) */}
            <section id="consultoria" className="relative py-32 bg-slate-900 border-t border-slate-800 overflow-hidden">
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
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-200/10 to-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/30 tracking-widest uppercase mb-8 shadow-lg shadow-amber-900/20 backdrop-blur-md">
                                    CRC Institutional
                                </span>
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 font-serif leading-tight">
                                    Arquitectura de <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">
                                        Impacto Social
                                    </span>
                                </h2>
                                <p className="text-lg text-slate-300 leading-relaxed mb-10 font-light border-l-2 border-amber-500/30 pl-6">
                                    Transformamos la complejidad social en estrategias operativas.
                                    Diseñamos, evaluamos y fortalecemos programas de alto nivel para gobiernos, fundaciones y corporaciones.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 py-6 rounded-none border-l-4 border-amber-500 shadow-xl transition-all hover:translate-x-1">
                                        Agendar Reunión Ejecutiva
                                        <ArrowRight className="ml-2 h-5 w-5 text-amber-600" />
                                    </Button>
                                    <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 hover:bg-slate-800/50 px-8 py-6 rounded-none backdrop-blur-sm">
                                        Descargar Portafolio
                                    </Button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column: Service Matrix */}
                        <div className="lg:col-span-7">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Card 1 */}
                                <div className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-8 hover:bg-slate-800/60 transition-all duration-300 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Building2 className="w-24 h-24 text-white" />
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold text-white mb-3 font-serif">Diseño de Modelos</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                            Creación de arquitecturas programáticas escalables y metodologías de intervención basadas en evidencia.
                                        </p>
                                        <div className="w-8 h-1 bg-amber-500/50 group-hover:w-full transition-all duration-500"></div>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-8 hover:bg-slate-800/60 transition-all duration-300 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Users className="w-24 h-24 text-white" />
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold text-white mb-3 font-serif">Gobernanza Técnica</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                            Establecimiento de estándares, supervisión clínica y sistemas de mejora continua para equipos de alto desempeño.
                                        </p>
                                        <div className="w-8 h-1 bg-amber-500/50 group-hover:w-full transition-all duration-500"></div>
                                    </div>
                                </div>

                                {/* Card 3 */}
                                <div className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-8 hover:bg-slate-800/60 transition-all duration-300 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <PenTool className="w-24 h-24 text-white" />
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold text-white mb-3 font-serif">Evaluación de Impacto</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                            Análisis riguroso de resultados cualitativos y cuantitativos para asegurar la sustentabilidad de la inversión social.
                                        </p>
                                        <div className="w-8 h-1 bg-amber-500/50 group-hover:w-full transition-all duration-500"></div>
                                    </div>
                                </div>

                                {/* Visual Feature Card */}
                                <div className="relative h-full min-h-[200px] rounded-sm overflow-hidden border border-slate-700/50 group">
                                    <img src="/images/strategic_architecture.png" alt="Strategic Architecture" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 scale-105 group-hover:scale-100" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-8">
                                        <span className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-2 block">Casos de Éxito</span>
                                        <h3 className="text-white font-serif text-lg">Revisa nuestros proyectos de incidencia pública &rarr;</h3>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
