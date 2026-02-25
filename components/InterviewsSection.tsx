"use client";

import { MotionDiv } from "@/components/ui/Motion";
import { Mic2, Radio, PlayCircle } from "lucide-react";
import { useState } from "react";
import { EditableText } from "@/components/editor/EditableText";

export function InterviewsSection() {
    const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);

    return (
        <section className="py-24 bg-gray-900 relative">
            {/* Global Hover Overlay */}
            <div
                className={`fixed inset-0 bg-black/95 transition-opacity duration-700 pointer-events-none z-40 ${hoveredVideo !== null ? "opacity-100" : "opacity-0"
                    }`}
            />

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] mix-blend-screen opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] mix-blend-screen opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                {/* Header Section */}
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className={`mb-16 md:flex md:items-end md:justify-between transition-opacity duration-700 relative ${hoveredVideo !== null ? "opacity-20 z-10" : "opacity-100 z-50"
                        }`}
                >
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs font-bold border border-blue-800 mb-6 shadow-sm">
                            <Mic2 className="w-3 h-3 mr-2" />
                            <EditableText path="homeInterviews.eyebrow" ariaLabel="Multimedia etiqueta" />
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl font-serif">
                            <EditableText path="homeInterviews.title" ariaLabel="Multimedia título" />
                        </h2>
                        <p className="mt-5 text-xl text-gray-400 font-light">
                            Explora nuestras participaciones en medios, donde analizamos críticamente la infancia y la salud mental pública.
                        </p>
                    </div>
                </MotionDiv>

                {/* Videos Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-50">

                    {/* Video 1 */}
                    <div
                        className={`group flex flex-col gap-6 transition-all duration-700 ease-out ${hoveredVideo === 1
                                ? "scale-[1.03] z-[60]"
                                : hoveredVideo !== null
                                    ? "scale-[0.97] opacity-40 z-30 grayscale-[60%] blur-[2px]"
                                    : "scale-100 z-40 hover:shadow-2xl"
                            }`}
                        onMouseEnter={() => setHoveredVideo(1)}
                        onMouseLeave={() => setHoveredVideo(null)}
                    >
                        <div className={`relative aspect-video rounded-2xl overflow-hidden bg-black border border-gray-800 ring-1 ring-white/10 transition-shadow duration-700 ${hoveredVideo === 1 ? 'shadow-[0_0_60px_-15px_rgba(59,130,246,0.6)] border-blue-500/30' : 'shadow-2xl'} `}>
                            {/* Inner vignette for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none" />
                            <iframe
                                className="w-full h-full absolute inset-0 z-10"
                                src="https://www.youtube.com/embed/QvJ5Y3pJyrY?si=L4v5xX1_D8z0Z0q9&controls=1&rel=0&modestbranding=1"
                                title="Entrevista Juan Carlos Rauld - Radio Usach"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Title 1 Content box */}
                        <div className={`flex-1 rounded-2xl p-6 sm:p-8 border transition-all duration-700 ${hoveredVideo === 1
                                ? "bg-gray-800 border-blue-500/30 shadow-lg"
                                : "bg-gray-800/40 backdrop-blur-md border-gray-700/50"
                            }`}>
                            <div className="flex items-center text-blue-400 text-xs sm:text-sm uppercase tracking-widest font-bold mb-4">
                                <Radio className="w-4 h-4 mr-2" />
                                Extensión Línea Uno
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-serif leading-tight">
                                &quot;Tecnócratas de la Infancia: Desprotección y Neoliberalismo&quot;
                            </h3>
                            <p className="text-base sm:text-lg text-gray-400 leading-relaxed font-light">
                                Una investigación crítica sobre el sistema de protección estatal y cómo la lógica del encierro administra la niñez.
                            </p>
                        </div>
                    </div>

                    {/* Video 2 */}
                    <div
                        className={`group flex flex-col gap-6 transition-all duration-700 ease-out ${hoveredVideo === 2
                                ? "scale-[1.03] z-[60]"
                                : hoveredVideo !== null
                                    ? "scale-[0.97] opacity-40 z-30 grayscale-[60%] blur-[2px]"
                                    : "scale-100 z-40 hover:shadow-2xl"
                            }`}
                        onMouseEnter={() => setHoveredVideo(2)}
                        onMouseLeave={() => setHoveredVideo(null)}
                    >
                        <div className={`relative aspect-video rounded-2xl overflow-hidden bg-black border border-gray-800 ring-1 ring-white/10 transition-shadow duration-700 ${hoveredVideo === 2 ? 'shadow-[0_0_60px_-15px_rgba(59,130,246,0.6)] border-blue-500/30' : 'shadow-2xl'} `}>
                            {/* Inner vignette for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none" />
                            <iframe
                                className="w-full h-full absolute inset-0 z-10"
                                src="https://www.youtube.com/embed/9fFTnDS0b6M?si=-9pnJbfy7Rsbyr3l&controls=1&rel=0&modestbranding=1"
                                title="Entrevista Juan Carlos Rauld - Experto en Políticas de Infancia"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Title 2 Content box */}
                        <div className={`flex-1 rounded-2xl p-6 sm:p-8 border transition-all duration-700 ${hoveredVideo === 2
                                ? "bg-gray-800 border-blue-500/30 shadow-lg"
                                : "bg-gray-800/40 backdrop-blur-md border-gray-700/50"
                            }`}>
                            <div className="flex items-center text-blue-400 text-xs sm:text-sm uppercase tracking-widest font-bold mb-4">
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Análisis en Profundidad
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-serif leading-tight">
                                &quot;Cuando un niño pobre en Chile entra a un centro de la infancia, enfrenta un proceso burocrático donde no se escucha al menor&quot;
                            </h3>
                            <p className="text-base sm:text-lg text-gray-400 leading-relaxed font-light">
                                Discusión experta sobre las fallas estructurales del sistema al momento de abordar la niñez vulnerada.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
