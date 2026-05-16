"use client";

import { MotionDiv } from "@/components/ui/Motion";
import { Tv2, PlayCircle, Radio, Mic2 } from "lucide-react";
import { useState } from "react";

const appearances = [
    {
        id: 1,
        youtubeId: "c-xOCEXFCXU",
        title: "Niños y Salud Mental: Una Mirada Crítica",
        channel: "YouTube",
        icon: PlayCircle,
        color: "from-[#bd6f3c]/30 to-[#172017]/10",
        badge: "Aparición en Medios",
        badgeColor: "text-[#d3976d] border-[#9f5528] bg-[#172017]/30",
    },
    {
        id: 2,
        youtubeId: "nhjSIADQy5A",
        title: "Infancia, Institucionalización y Biopolítica",
        channel: "YouTube",
        icon: Mic2,
        color: "from-[#bd6f3c]/25 to-[#172017]/10",
        badge: "Entrevista",
        badgeColor: "text-[#d3976d] border-[#9f5528] bg-[#172017]/30",
    },
    {
        id: 3,
        youtubeId: "7iXQ6jZ6o78",
        title: "Salud Mental Infantil y Neoliberalismo",
        channel: "YouTube",
        icon: Radio,
        color: "from-[#bd6f3c]/28 to-[#172017]/10",
        badge: "Análisis",
        badgeColor: "text-[#d3976d] border-[#9f5528] bg-[#172017]/30",
    },
    {
        id: 4,
        youtubeId: "bc42h4sMbc0",
        title: "Desprotección de la Infancia en Chile",
        channel: "YouTube",
        icon: Tv2,
        color: "from-[#9f5528]/30 to-[#172017]/10",
        badge: "Debate",
        badgeColor: "text-[#d3976d] border-[#9f5528] bg-[#172017]/30",
    },
    {
        id: 5,
        youtubeId: "QvJ5Y3pJyrY",
        title: '"Tecnócratas de la Infancia: Desprotección y Neoliberalismo"',
        channel: "Extensión Línea Uno",
        icon: Radio,
        color: "from-[#737d69]/30 to-[#172017]/10",
        badge: "Radio",
        badgeColor: "text-[#d3976d] border-[#9f5528] bg-[#172017]/30",
    },
    {
        id: 6,
        youtubeId: "9fFTnDS0b6M",
        title: '"Cuando un niño pobre en Chile entra a un centro de la infancia…"',
        channel: "Análisis en Profundidad",
        icon: Mic2,
        color: "from-[#737d69]/35 to-[#172017]/10",
        badge: "Entrevista",
        badgeColor: "text-[#d3976d] border-[#9f5528] bg-[#172017]/30",
    },
];

export function MediaAppearancesSection() {
    const [activeVideo, setActiveVideo] = useState<number | null>(null);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    return (
        <section className="relative overflow-hidden bg-[#171713] py-14 sm:py-20">
            {/* Cinematic gradient overlays */}
            <div className="pointer-events-none absolute inset-0 z-0">
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <MotionDiv
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-12 sm:mb-16"
                >
                    <div className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#4b4e45] bg-[#2a2d26]/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a99f91] backdrop-blur-sm mb-4">
                        <Tv2 className="h-3 w-3 text-[#70695f]" />
                        En los Medios
                    </div>
                    <div className="flex flex-col gap-2">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-serif">
                                Apariciones de{" "}
                                <span className="text-[#f8f5ee]">
                                    Juan Carlos Rauld
                                </span>
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm text-[#a99f91] font-light leading-relaxed">
                                Entrevistas, análisis y debates en medios y plataformas digitales sobre salud mental infantil, infancia y políticas públicas.
                            </p>
                        </div>
                    </div>
                </MotionDiv>

                {/* Active Video Player */}
                {activeVideo !== null && (
                    <MotionDiv
                        key={activeVideo}
                        initial={{ opacity: 0, y: 16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="mb-10 overflow-hidden rounded-[8px] border border-[#34362f] shadow-[0_0_80px_-20px_rgba(189,111,60,0.24)]"
                    >
                        <div className="relative aspect-video bg-[#0f0d0a]">
                            <iframe
                                className="absolute inset-0 h-full w-full"
                                src={`https://www.youtube.com/embed/${appearances.find(a => a.id === activeVideo)?.youtubeId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
                                title="Video destacado"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                        <div className="flex items-center justify-between bg-[#172017] px-4 py-3 border-t border-[#34362f]">
                            <p className="text-xs font-semibold text-white line-clamp-1 max-w-lg">
                                {appearances.find(a => a.id === activeVideo)?.title}
                            </p>
                            <button
                                onClick={() => setActiveVideo(null)}
                                className="text-[10px] font-bold uppercase tracking-widest text-[#70695f] hover:text-[#d8d0c4] transition-colors ml-4 shrink-0"
                            >
                                Cerrar ✕
                            </button>
                        </div>
                    </MotionDiv>
                )}

                {/* Netflix-style Catalog Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {appearances.map((item, idx) => {
                        const Icon = item.icon;
                        const isHovered = hoveredId === item.id;
                        const isActive = activeVideo === item.id;

                        return (
                            <MotionDiv
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.08 }}
                                className={`group relative cursor-pointer overflow-hidden rounded-[8px] border transition-all duration-500 ${
                                    isActive
                                        ? "border-[#bd6f3c]/40 bg-[#172017]/20 shadow-[0_0_30px_rgba(189,111,60,0.2)]"
                                        : isHovered
                                        ? "border-[#5b5f53] bg-[#2a2d26]/60 -translate-y-1 shadow-sm"
                                        : "border-[#34362f]/60 bg-[#172017]/40"
                                }`}
                                onMouseEnter={() => setHoveredId(item.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => setActiveVideo(item.id)}
                            >
                                {/* Thumbnail / Preview Area */}
                                <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${item.color} bg-[#172017]`}>
                                    <img
                                        src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`}
                                        alt={item.title}
                                        className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                                    />
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#172017] via-[#172017]/20 to-transparent" />

                                    {/* Play button */}
                                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered || isActive ? "opacity-100" : "opacity-0"}`}>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#fffdf8]/95 shadow-md ring-2 ring-white/20 transition-transform duration-300 group-hover:scale-110">
                                            <PlayCircle className="h-5 w-5 text-[#171713] fill-[#171713]" />
                                        </div>
                                    </div>

                                    {/* Badge */}
                                    <div className="absolute top-2 left-2">
                                        <span className={`inline-flex items-center gap-1 rounded-[5px] border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm ${item.badgeColor}`}>
                                            <Icon className="h-2.5 w-2.5" />
                                            {item.badge}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-3.5">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#70695f] mb-1">
                                        {item.channel}
                                    </p>
                                    <h3 className="text-sm font-semibold leading-snug text-white line-clamp-2 group-hover:text-[#f8f5ee] transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#70695f] group-hover:text-[#a99f91] transition-colors">
                                        <PlayCircle className="h-3 w-3" />
                                        Ver aquí
                                    </div>
                                </div>

                                {/* Active indicator strip */}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#bd6f3c] to-[#737d69]" />
                                )}
                            </MotionDiv>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
