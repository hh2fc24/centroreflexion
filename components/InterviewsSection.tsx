"use client";

import { MotionDiv } from "@/components/ui/Motion";
import { Play, Mic2 } from "lucide-react";
import Image from "next/image";

export function InterviewsSection() {
    return (
        <section className="py-24 bg-gray-900 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] mix-blend-screen opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] mix-blend-screen opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-12 md:flex md:items-end md:justify-between"
                >
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs font-bold border border-blue-800 mb-6">
                            <Mic2 className="w-3 h-3 mr-2" />
                            MULTIMEDIA
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-serif">
                            Conversaciones Críticas
                        </h2>
                        <p className="mt-4 text-lg text-gray-400">
                            Diálogos profundos con nuestros fundadores y expertos invitados.
                        </p>
                    </div>
                </MotionDiv>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Featured Video - Takes up 2 columns */}
                    <MotionDiv
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-2 group relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-gray-800 ring-1 ring-white/10"
                    >
                        <iframe
                            className="w-full h-full absolute inset-0"
                            src="https://www.youtube.com/embed/QvJ5Y3pJyrY?si=L4v5xX1_D8z0Z0q9&controls=1&rel=0&modestbranding=1"
                            title="Entrevista Juan Carlos Rauld"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </MotionDiv>

                    {/* Secondary Content / Placeholder for more */}
                    <MotionDiv
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col justify-center space-y-6"
                    >
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:bg-gray-800 transition-colors cursor-pointer group">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Play className="w-5 h-5 ml-1" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                        Entrevista a Juan Carlos Rauld
                                    </h3>
                                    <p className="text-sm text-gray-400 line-clamp-2">
                                        Reflexiones sobre el impacto de la tecnología en la salud mental infantil y los desafíos de la educación moderna.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 flex items-center justify-center text-center h-full min-h-[150px]">
                            <div>
                                <p className="text-gray-500 text-sm mb-2">Próximamente</p>
                                <p className="text-white font-medium">Más conversaciones en camino</p>
                            </div>
                        </div>
                    </MotionDiv>
                </div>
            </div>
        </section>
    );
}
