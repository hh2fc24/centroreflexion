"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Mail } from "lucide-react";
import { RocioPortfolio } from "@/components/RocioPortfolio";

export default function About() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden bg-gray-900 py-32 sm:py-48">
                <div className="absolute inset-0 -z-10 bg-black/60" />
                <div className="absolute inset-0 -z-20">
                    <Image
                        src="/images/library_bg.jpg"
                        alt="Library background"
                        fill
                        className="object-cover opacity-20"
                    />
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-md font-serif"
                    >
                        Quiénes Somos
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 text-xl leading-8 text-gray-200 max-w-2xl mx-auto font-light"
                    >
                        Articulando academia, clínica y política pública.
                    </motion.p>
                </div>
            </div>

            {/* Mission & Vision */}
            <section className="py-24 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Misión</h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Unir el pensamiento crítico, la intervención clínica real y la transformación institucional.
                                Buscamos generar espacios donde la reflexión académica se traduzca en cambios concretos
                                para la salud mental, la infancia y la cultura.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Visión</h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Ser una plataforma de referencia iberoamericana en pensamiento crítico aplicado,
                                consolidándonos como un centro de articulación clave entre la producción académica,
                                la práctica clínica y el diseño de políticas públicas.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
                <div className="space-y-24">

                    {/* Juan Carlos Rauld */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        <div className="lg:col-span-4 flex flex-col items-center text-center lg:text-left lg:items-start">
                            <div className="h-64 w-64 rounded-xl bg-gray-200 mb-6 relative overflow-hidden shadow-lg">
                                <Image
                                    src="/images/juan_carlos_20260224.png"
                                    alt="Juan Carlos Rauld"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 font-serif">Juan Carlos Rauld</h3>
                            <p className="text-blue-600 font-bold text-sm tracking-wide mt-2 uppercase">Director CRC & Consultor en Ciencias Sociales</p>

                            <div className="mt-6 flex gap-4">
                                <a href="https://www.linkedin.com/in/juan-carlos-rauld-farias-a64710a4/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors"><Linkedin className="h-6 w-6" /></a>
                            </div>
                        </div>
                        <div className="lg:col-span-8 space-y-8">
                            <div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Rol Editorial y Académico</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    <strong>Juan Carlos Rauld es trabajador social.</strong> Magíster en Pensamiento Contemporáneo en Filosofía y Pensamiento Político del Instituto de Filosofía de la Universidad Diego Portales, e investigador del Centro de Reflexiones Críticas. Sus áreas de interés son el trauma psíquico infantil, la filosofía social y política contemporánea, especialmente la biopolítica de la infancia pobre en Chile y la filosofía de la infancia. Posee una doble especialización en salud mental infantil y en filosofía práctica de la niñez, desde el siglo XIX hasta la actualidad.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Consultoría Estratégica e Institucional</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Como consultor en <strong>Gestión Estratégica de Programas de Infancia y Salud Mental</strong>, acompaña a organizaciones públicas y privadas en el diseño y rediseño de modelos de intervención, arquitectura programática e implementación de indicadores de desempeño. Lidera procesos de fortalecimiento técnico, gobernanza institucional y evaluación de impacto para asegurar coherencia, sostenibilidad e impacto verificable.
                                </p>
                            </div>
                            <div className="pt-4">
                                <Link href="/servicios#consultoria">
                                    <Button variant="outline">Consultar Servicios Estratégicos</Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-100" />

                    {/* Rocío Solar */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        <div className="lg:col-span-4 flex flex-col items-center text-center lg:text-left lg:items-start lg:order-last">
                            <div className="h-64 w-64 rounded-xl bg-gray-200 mb-6 relative overflow-hidden shadow-lg">
                                <Image
                                    src="/images/rocio_solar.png"
                                    alt="Rocío Solar"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 font-serif">Rocío Solar</h3>
                            <p className="text-red-600 font-bold text-sm tracking-wide mt-2 uppercase">
                                Co-fundadora y Editora de Medios Digitales<br />
                                <span className="text-pink-600">Terapeuta Ocupacional</span>
                            </p>
                            <div className="mt-6 flex gap-4">
                                <a href="https://www.instagram.com/centrodereflexionescriticas/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors"><Instagram className="h-6 w-6" /></a>
                                <a href="mailto:centrodereflexionescriticas@gmail.com" className="text-gray-400 hover:text-red-600 transition-colors"><Mail className="h-6 w-6" /></a>
                                <a href="https://www.linkedin.com/in/roc%C3%ADo-solar-guerra-168693138/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors"><Linkedin className="h-6 w-6" /></a>
                            </div>
                        </div>
                        <div className="lg:col-span-8 space-y-8 lg:text-right">
                            <div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 lg:ml-auto lg:w-fit">Función como Co-fundadora y Editora</h4>
                                <ul className="text-gray-600 leading-relaxed space-y-3 text-left lg:text-right">
                                    <li>– Liderar y coordinar la producción, edición y publicación de contenidos digitales para la plataforma, asegurando calidad editorial, coherencia conceptual y pertinencia con los objetivos del centro.</li>
                                    <li>– Diseñar estrategias comunicacionales y de difusión en redes y medios digitales para fortalecer el posicionamiento, alcance y visibilidad de las reflexiones críticas desde una perspectiva analítica y reflexiva.</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 lg:ml-auto lg:w-fit">Función Clínica – Terapeuta Ocupacional</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Evaluación e intervención terapéutica ocupacional en salud mental infanto-juvenil, orientada al desarrollo del desempeño ocupacional, regulación emocional, autonomía y participación en contextos familiares y educativos, mediante planes de intervención individual y familiar, trabajo interdisciplinario y seguimiento clínico.
                                </p>
                            </div>
                        </div>
                    </div>

                    <RocioPortfolio />

                </div>
            </div>

            {/* Video Section Title - Placeholder for the actual video component if requested later */}
            <section className="py-24 bg-gray-900 text-white text-center">
                <div className="mx-auto max-w-4xl px-4">
                    <h2 className="text-3xl font-bold mb-8 font-serif">Nuestra Historia en Imágenes</h2>
                    <div className="aspect-video bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700">
                        <p className="text-gray-500">Video Institucional &quot;Quiénes Somos&quot; (Próximamente)</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
