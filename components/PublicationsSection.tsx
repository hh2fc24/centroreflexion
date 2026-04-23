"use client";

import { MotionDiv } from "@/components/ui/Motion";
import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import { VideoBookPremiere } from "./VideoBookPremiere";
import { EditableText } from "@/components/editor/EditableText";

export function PublicationsSection() {
    return (
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef4f7_45%,#f8fafc_100%)] py-16 sm:py-24">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-100/70 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-12 text-center sm:mb-16"
                >
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 mb-4">
                        <BookOpen className="w-3 h-3 mr-2" />
                        <EditableText path="homePublications.eyebrow" ariaLabel="Publicaciones etiqueta" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-serif">
                        <EditableText path="homePublications.title" ariaLabel="Publicaciones título" />
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
                        <EditableText path="homePublications.subtitle" ariaLabel="Publicaciones subtítulo" multiline />
                    </p>
                </MotionDiv>

                <VideoBookPremiere />

                <div id="catalogo-editorial" className="mt-16 sm:mt-20">
                    <div className="flex flex-col gap-3 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                                Catálogo editorial
                            </p>
                            <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 font-serif sm:text-3xl">
                                Libros destacados
                            </h3>
                        </div>
                        <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-right">
                            Una selección de títulos que profundizan la crítica sobre infancia, institucionalización, trauma y políticas públicas.
                        </p>
                    </div>
                </div>

                <div className="mt-12 space-y-16 sm:mt-16 sm:space-y-24">
                    {/* Book 1: Desprotección de la Infancia */}
                    <MotionDiv
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center gap-8 md:flex-row md:gap-12"
                    >
                        <div className="group relative flex w-full justify-center md:w-1/2 md:justify-end perspective-1000">
                            <div className="relative aspect-[7/10] w-full max-w-[220px] transition-transform duration-500 transform group-hover:rotate-y-[-10deg] group-hover:scale-105 sm:max-w-[280px]">
                                <div className="absolute inset-0 bg-blue-900/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <Image
                                    src="/images/book_desproteccion.png"
                                    alt="Portada Desprotección de la Infancia"
                                    fill
                                    className="object-contain drop-shadow-2xl relative z-10"
                                />
                            </div>
                        </div>
                        <div className="w-full text-center md:w-1/2 md:text-left">
                            <h3 className="mb-2 text-2xl font-bold text-gray-900 font-serif">
                                Desprotección de la Infancia
                            </h3>
                            <h4 className="mb-5 text-base font-semibold text-blue-600 sm:mb-6 sm:text-lg">
                                Dominación, Biopolítica y Gobierno
                            </h4>
                            <div className="prose mb-6 max-w-none text-left leading-relaxed text-gray-600 sm:mb-8">
                                <p>
                                    Un examen genealógico de la desprotección infantil en Chile desde el siglo XIX.
                                    A partir del concepto de <strong>biopolítica de Michel Foucault</strong>, el autor analiza cómo la institucionalización infantil ha operado como estrategia de gobierno y control sobre el &quot;bajo pueblo&quot;.
                                </p>
                                <p className="mt-2 text-sm italic border-l-4 border-gray-200 pl-4">
                                    &quot;No habría biopolítica sin estricta relación con el poder disciplinario, pues en el poder que se ejerce sobre la vida del niño, su vida está inexorablemente ligada a la muerte.&quot;
                                </p>
                            </div>
                            <a
                                href="https://www.editorialhammurabi.com/shop/derecho/privado/derecho-civil/derecho-familiar/desproteccion-de-la-infancia/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-full items-center justify-center rounded-full border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-all hover:translate-x-1 hover:bg-blue-700 sm:w-auto"
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
                        className="flex flex-col items-center gap-8 md:flex-row-reverse md:gap-12"
                    >
                        <div className="group relative flex w-full justify-center md:w-1/2 md:justify-start perspective-1000">
                            <div className="relative aspect-[7/10] w-full max-w-[220px] transition-transform duration-500 transform group-hover:rotate-y-[10deg] group-hover:scale-105 sm:max-w-[280px]">
                                <div className="absolute inset-0 bg-purple-900/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <Image
                                    src="/images/book_perspectivas.png"
                                    alt="Portada Perspectivas Críticas de la Salud Mental Infantil"
                                    fill
                                    className="object-contain drop-shadow-2xl relative z-10"
                                />
                            </div>
                        </div>
                        <div className="w-full text-center md:w-1/2 md:text-right">
                            <div className="flex flex-col items-center md:items-end">
                                <h3 className="mb-2 text-2xl font-bold text-gray-900 font-serif">
                                    Perspectivas Críticas de la Salud Mental Infantil
                                </h3>
                                <h4 className="mb-5 text-base font-semibold text-purple-600 sm:mb-6 sm:text-lg">
                                    Trauma, Institucionalización y Suplicio
                                </h4>
                                <div className="prose mb-6 max-w-none text-left leading-relaxed text-gray-600 sm:mb-8 md:text-right">
                                    <p>
                                        Un trabajo multidisciplinario que aborda los desafíos éticos y clínicos de la unidad de corta estadía del <strong>Hospital Luis Calvo Mackenna</strong>.
                                    </p>
                                    <p className="mt-2">
                                        Surge de la experiencia directa con la niñez vulnerada, cuestionando las hospitalizaciones coercitivas y analizando conceptos como trauma, institucionalización y suplicio desde una mirada crítica y comprometida.
                                    </p>
                                </div>
                                <a
                                    href="https://www.editorialhammurabi.com/shop/derecho/privado/derecho-civil/derecho-familiar/desproteccion-de-la-infancia/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex w-full items-center justify-center rounded-full border border-transparent bg-purple-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-all hover:-translate-x-1 hover:bg-purple-700 sm:w-auto"
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
