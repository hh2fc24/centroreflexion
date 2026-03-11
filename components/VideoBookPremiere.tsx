"use client";

import { MotionDiv } from "@/components/ui/Motion";
import { Calendar } from "lucide-react";
import { useRef } from "react";

export function VideoBookPremiere() {
    const videoRef = useRef<HTMLVideoElement>(null);

    return (
        <section className="relative w-full overflow-hidden bg-black py-16 text-white sm:py-24">
            {/* Background Gradient/Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-0" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-24">

                    {/* Content / Synopsis - LEFT COLUMN */}
                    <MotionDiv
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="order-2 text-center lg:order-1 lg:text-left"
                    >
                        <span className="mb-6 inline-block rounded-sm border border-gray-700 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-gray-400 sm:mb-8">
                            Próximamente
                        </span>

                        <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-white sm:mb-6 sm:text-4xl md:text-5xl font-serif">
                            Tecnócratas de la infancia
                        </h2>
                        <p className="mb-6 text-lg font-light tracking-wide text-gray-400 sm:mb-8 sm:text-xl">
                            Desprotección y neoliberalismo en Chile
                        </p>

                        <div className="prose prose-invert mx-auto mb-8 max-w-none text-base leading-relaxed text-gray-300 sm:prose-lg lg:mx-0">
                            <p className="mb-6">
                                <span className="text-white font-semibold">En este libro</span>, el autor desmonta la gestión tecnocrática de la infancia pobre, demostrando que la desprotección es un efecto estructural del neoliberalismo.
                            </p>
                            <p className="mb-6">
                                Una lectura genealógica que revela cómo el Estado administra el sufrimiento infantil bajo la noción de <span className="text-white font-semibold italic">suplicio</span>, cuestionando las lógicas de eficiencia que normalizan la violencia institucional.
                            </p>
                            <p>
                                Con una escritura aguda y comprometida, el libro interpela a profesionales y decisores públicos, cuestionando las lógicas que han normalizado la violencia estatal sobre los cuerpos infantiles.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-4 border-t border-gray-800 pt-6 text-left sm:pt-8 lg:justify-start">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600/20 text-blue-400">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Disponible desde</p>
                                <p className="text-2xl font-bold text-white font-serif">Marzo de 2026</p>
                            </div>
                        </div>
                    </MotionDiv>

                    {/* Video Container - RIGHT COLUMN */}
                    <MotionDiv
                        initial={{ opacity: 0, scale: 0.95, x: 30 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="group order-1 relative mx-auto w-full max-w-[280px] sm:max-w-sm lg:order-2 lg:ml-auto lg:mr-0"
                    >
                        {/* Floating Shadow Effect */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-16 bg-blue-600/20 blur-[40px] rounded-full opacity-60 pointer-events-none transition-opacity duration-500 group-hover:opacity-80" />

                        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden ring-1 ring-white/10 bg-gray-900 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                                poster="/images/hero-bg.jpg"
                            >
                                <source src="/libro.mov" type="video/quicktime" />
                                <source src="/libro.mov" type="video/mp4" />
                                Tu navegador no soporta el elemento de video.
                            </video>

                            {/* Inner vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                        </div>
                    </MotionDiv>

                </div>
            </div>
        </section>
    );
}
