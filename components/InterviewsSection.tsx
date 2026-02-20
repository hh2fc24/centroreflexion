"use client";

import { MotionDiv } from "@/components/ui/Motion";
import { Mic2, Radio } from "lucide-react";
import { useRef, useState } from "react";
import { EditableText } from "@/components/editor/EditableText";

export function InterviewsSection() {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

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
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs font-bold border border-blue-800 mb-6">
                            <Mic2 className="w-3 h-3 mr-2" />
                            <EditableText path="homeInterviews.eyebrow" ariaLabel="Multimedia etiqueta" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-serif">
                            <EditableText path="homeInterviews.title" ariaLabel="Multimedia título" />
                        </h2>
                        <p className="mt-4 text-lg text-gray-400 italic">
                            <EditableText path="homeInterviews.subtitle" ariaLabel="Multimedia subtítulo" multiline />
                        </p>
                    </div>
                </MotionDiv>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Featured Video - Takes up 2 columns */}
                    <MotionDiv
                        ref={divRef}
                        onMouseMove={handleMouseMove}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-2 group relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-gray-800 ring-1 ring-white/10"
                    >
                        <div
                            className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-20"
                            style={{
                                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
                            }}
                        />
                        <iframe
                            className="w-full h-full absolute inset-0 z-10"
                            src="https://www.youtube.com/embed/QvJ5Y3pJyrY?si=L4v5xX1_D8z0Z0q9&controls=1&rel=0&modestbranding=1"
                            title="Entrevista Juan Carlos Rauld"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </MotionDiv>

                    {/* Secondary Content / Context */}
                    <MotionDiv
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col justify-between space-y-6"
                    >
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:bg-gray-800 transition-colors">
                            <div className="flex items-start gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        Entrevista en Radio Usach
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        En <span className="text-blue-400 font-semibold">Extensión Línea Uno</span>, conversamos sobre el libro &quot;Tecnócratas de la Infancia: Desprotección y Neoliberalismo en Chile&quot;. Una investigación crítica sobre el sistema de protección estatal.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-white/5">
                            <div className="flex items-center text-white font-medium mb-2">
                                <Radio className="w-5 h-5 mr-2 text-blue-400" />
                                94.5 FM
                            </div>
                            <p className="text-gray-400 text-sm">Escucha en www.diariousach.cl o TVD Señal 50.2 📺</p>
                        </div>
                    </MotionDiv>
                </div>
            </div>
        </section>
    );
}
