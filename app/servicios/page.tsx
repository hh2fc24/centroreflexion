"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Check, ArrowRight, BookOpen, PenTool, Users, Building2 } from "lucide-react";

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
                                Evaluación y Consultoría Psicosocial
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
                                    <li key={idx} className="flex items-start justify-between border-b border-gray-100 pb-2">
                                        <div className="flex items-center text-gray-700">
                                            <Check className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                                            <span>{item.name}</span>
                                        </div>
                                        <span className="font-semibold text-gray-900 text-sm ml-4">{item.price}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                                Solicitar Evaluación
                            </Button>
                        </div>
                        <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
                            {/* Placeholder for clinical image */}
                            <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                [Imagen Contexto Clínico]
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* B) Atención Clínica Rocío Solar */}
            <section id="terapia-ocupacional" className="py-24 bg-gray-50 border-b border-gray-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-last lg:order-first relative h-[500px] rounded-2xl overflow-hidden bg-white shadow-xl">
                            {/* Placeholder for clinical image */}
                            <div className="absolute inset-0 bg-purple-900/10 mix-blend-multiply" />
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                [Imagen Terapia Ocupacional]
                            </div>
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

            {/* C) Charlas y Formación */}
            <section id="formacion" className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-green-600 font-bold tracking-wide uppercase text-sm">Educación Continua</span>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-2 font-serif">Charlas y Formación</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            Instancias de aprendizaje para equipos profesionales, comunidades educativas y organizaciones.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Service Item */}
                        <div className="bg-gray-50 rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Charlas Individuales</h3>
                            <p className="text-gray-600 text-sm mb-6 min-h-[80px]">
                                Exposiciones temáticas de Rocío Solar sobre salud mental, género y cuidados.
                            </p>
                            <ul className="text-sm text-gray-500 space-y-2 mb-6 border-t border-gray-200 pt-4">
                                <li>• Modalidad: Presencial / Online</li>
                                <li>• Duración: 60 - 90 min</li>
                            </ul>
                            <span className="text-green-600 font-bold">Consultar Valor</span>
                        </div>

                        {/* Service Item */}
                        <div className="bg-gray-50 rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-lg border-2 border-green-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Formación de Equipos</h3>
                            <p className="text-gray-600 text-sm mb-6 min-h-[80px]">
                                Capacitaciones conjuntas sobre intervención en crisis, VIF y gestión de casos complejos.
                            </p>
                            <ul className="text-sm text-gray-500 space-y-2 mb-6 border-t border-gray-200 pt-4">
                                <li>• Certificado de participación</li>
                                <li>• Material complementario</li>
                            </ul>
                            <span className="text-green-600 font-bold">A medida</span>
                        </div>

                        {/* Service Item */}
                        <div className="bg-gray-50 rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Asesorías PIE</h3>
                            <p className="text-gray-600 text-sm mb-6 min-h-[80px]">
                                Supervisión reflexiva y apoyo técnico para Programas de Integración Escolar.
                            </p>
                            <ul className="text-sm text-gray-500 space-y-2 mb-6 border-t border-gray-200 pt-4">
                                <li>• Enfoque de derechos</li>
                                <li>• Prevención de crisis</li>
                            </ul>
                            <span className="text-green-600 font-bold">Plan mensual</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* D) Consultoría Estratégica (Premium) */}
            <section id="consultoria" className="py-24 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.svg')]"></div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-5 text-left">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-bold border border-yellow-500/20 tracking-wide mb-8">
                                SERVICIO PREMIUM
                            </div>
                            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6 font-serif">
                                Consultoría en Gestión Estratégica
                            </h2>
                            <p className="text-lg text-gray-300 leading-relaxed mb-8">
                                Diseñamos y fortalecemos la arquitectura de programas sociales de alto impacto.
                                Un servicio exclusivo para fundaciones, organismos gubernamentales y corporaciones.
                            </p>
                            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8">
                                Agendar Reunión Ejecutiva
                            </Button>
                        </div>

                        <div className="lg:col-span-1"></div>

                        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                "Diseño de Modelos",
                                "Arquitectura Programática",
                                "Evaluación Metodológica",
                                "Gobernanza Técnica",
                                "Fortalecimiento Institucional",
                                "Sustentabilidad de Proyectos"
                            ].map((item, idx) => (
                                <div key={idx} className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col justify-center hover:bg-gray-750 transition-colors">
                                    <Building2 className="h-8 w-8 text-blue-400 mb-4" />
                                    <span className="font-semibold text-white">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
