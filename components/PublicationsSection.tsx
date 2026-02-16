"use client";

import { MotionDiv } from "@/components/ui/Motion";
import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function PublicationsSection() {
    return (
        <section className="py-24 bg-gray-50 overflow-hidden relative">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/images/pattern.svg')]" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 mb-4">
                        <BookOpen className="w-3 h-3 mr-2" />
                        PUBLICACIONES
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-serif">
                        Libros Publicados
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Investigaciones que profundizan en la infancia, la biopolítica y la salud mental desde una perspectiva crítica.
                    </p>
                </MotionDiv>

                <div className="space-y-24">
                    {/* Book 1: Desprotección de la Infancia */}
                    <MotionDiv
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col md:flex-row items-center gap-12"
                    >
                        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative group perspective-1000">
                            <div className="relative w-[280px] h-[400px] transition-transform duration-500 transform group-hover:rotate-y-[-10deg] group-hover:scale-105">
                                <div className="absolute inset-0 bg-blue-900/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <Image
                                    src="/images/book_desproteccion.png"
                                    alt="Portada Desprotección de la Infancia"
                                    fill
                                    className="object-contain drop-shadow-2xl relative z-10"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 text-left">
                            <h3 className="text-2xl font-bold text-gray-900 font-serif mb-2">
                                Desprotección de la Infancia
                            </h3>
                            <h4 className="text-lg text-blue-600 font-semibold mb-6">
                                Dominación, Biopolítica y Gobierno
                            </h4>
                            <div className="prose text-gray-600 mb-8 leading-relaxed">
                                <p>
                                    Un examen genealógico de la desprotección infantil en Chile desde el siglo XIX.
                                    A partir del concepto de <strong>biopolítica de Michel Foucault</strong>, el autor analiza cómo la institucionalización infantil ha operado como estrategia de gobierno y control sobre el "bajo pueblo".
                                </p>
                                <p className="mt-2 text-sm italic border-l-4 border-gray-200 pl-4">
                                    "No habría biopolítica sin estricta relación con el poder disciplinario, pues en el poder que se ejerce sobre la vida del niño, su vida está inexorablemente ligada a la muerte."
                                </p>
                            </div>
                            <a
                                href="https://www.editorialhammurabi.com/shop/derecho/privado/derecho-civil/derecho-familiar/desproteccion-de-la-infancia/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all hover:translate-x-1"
                            >
                                Adquirir en Editorial Hammurabi
                                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                            </a>
                        </div>
                    </MotionDiv>

                    {/* Book 2: Perspectivas Críticas */}
                    <MotionDiv
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col md:flex-row-reverse items-center gap-12"
                    >
                        <div className="w-full md:w-1/2 flex justify-center md:justify-start relative group perspective-1000">
                            <div className="relative w-[280px] h-[400px] transition-transform duration-500 transform group-hover:rotate-y-[10deg] group-hover:scale-105">
                                <div className="absolute inset-0 bg-purple-900/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <Image
                                    src="/images/book_perspectivas.png"
                                    alt="Portada Perspectivas Críticas de la Salud Mental Infantil"
                                    fill
                                    className="object-contain drop-shadow-2xl relative z-10"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 text-left md:text-right">
                            <div className="flex flex-col items-start md:items-end">
                                <h3 className="text-2xl font-bold text-gray-900 font-serif mb-2">
                                    Perspectivas Críticas de la Salud Mental Infantil
                                </h3>
                                <h4 className="text-lg text-purple-600 font-semibold mb-6">
                                    Trauma, Institucionalización y Suplicio
                                </h4>
                                <div className="prose text-gray-600 mb-8 leading-relaxed md:text-right">
                                    <p>
                                        Un trabajo multidisciplinario que aborda los desafíos éticos y clínicos de la unidad de corta estadía del <strong>Hospital Luis Calvo Mackenna</strong>.
                                    </p>
                                    <p className="mt-2">
                                        Surge de la experiencia directa con la niñez vulnerada, cuestionando las hospitalizaciones coercitivas y analizando conceptos como trauma, institucionalización y suplicio desde una mirada crítica y comprometida.
                                    </p>
                                </div>
                                <a
                                    href="https://www.editorialhammurabi.com/shop/derecho/privado/derecho-civil/derecho-familiar/desproteccion-de-la-infancia/" // Using the main link as they are from the same editorial, user didn't provide specific link for 2nd book but usually they are navigable. Or I'll use the main shop link if I had it, but I'll stick to the one provided or try to find the specific one? The user provided one link for both "ambos de editorial...". I will use that link for both for now or search/guess. Wait, I scraped the 2nd book, I should check if I have the URL. I don't have the product URL in the scrape result, only image. I will use the collection link provided by user for both to be safe.
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-all hover:-translate-x-1"
                                >
                                    Adquirir en Editorial Hammurabi
                                    <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </MotionDiv>
                </div>
            </div>
        </section>
    );
}
