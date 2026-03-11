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
        color: "from-blue-600/30 to-blue-900/10",
        badge: "Aparición en Medios",
        badgeColor: "text-blue-400 border-blue-800 bg-blue-900/30",
    },
    {
        id: 2,
        youtubeId: "nhjSIADQy5A",
        title: "Infancia, Institucionalización y Biopolítica",
        channel: "YouTube",
        icon: Mic2,
        color: "from-purple-600/30 to-purple-900/10",
        badge: "Entrevista",
        badgeColor: "text-purple-400 border-purple-800 bg-purple-900/30",
    },
    {
        id: 3,
        youtubeId: "7iXQ6jZ6o78",
        title: "Salud Mental Infantil y Neoliberalismo",
        channel: "YouTube",
        icon: Radio,
        color: "from-amber-600/30 to-amber-900/10",
        badge: "Análisis",
        badgeColor: "text-amber-400 border-amber-800 bg-amber-900/30",
    },
    {
        id: 4,
        youtubeId: "bc42h4sMbc0",
        title: "Desprotección de la Infancia en Chile",
        channel: "YouTube",
        icon: Tv2,
        color: "from-rose-600/30 to-rose-900/10",
        badge: "Debate",
        badgeColor: "text-rose-400 border-rose-800 bg-rose-900/30",
    },
    {
        id: 5,
        youtubeId: "QvJ5Y3pJyrY",
        title: '"Tecnócratas de la Infancia: Desprotección y Neoliberalismo"',
        channel: "Extensión Línea Uno",
        icon: Radio,
        color: "from-cyan-600/30 to-cyan-900/10",
        badge: "Radio",
        badgeColor: "text-cyan-400 border-cyan-800 bg-cyan-900/30",
    },
    {
        id: 6,
        youtubeId: "9fFTnDS0b6M",
        title: '"Cuando un niño pobre en Chile entra a un centro de la infancia…"',
        channel: "Análisis en Profundidad",
        icon: Mic2,
        color: "from-green-600/30 to-green-900/10",
        badge: "Entrevista",
        badgeColor: "text-green-400 border-green-800 bg-green-900/30",
    },
];

export function MediaAppearancesSection() {
    const [activeVideo, setActiveVideo] = useState<number | null>(null);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    return (
        <section className="relative overflow-hidden bg-zinc-950 py-14 sm:py-20">
            {/* Cinematic gradient overlays */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-900/10 blur-[120px]" />
                <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-purple-900/10 blur-[120px]" />
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
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 backdrop-blur-sm mb-4">
                        <Tv2 className="h-3 w-3 text-zinc-500" />
                        En los Medios
                    </div>
                    <div className="flex flex-col gap-2">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-serif">
                                Apariciones de{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-white to-zinc-400">
                                    Juan Carlos Rauld
                                </span>
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm text-zinc-400 font-light leading-relaxed">
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
                        className="mb-10 overflow-hidden rounded-2xl border border-zinc-800 shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)]"
                    >
                        <div className="relative aspect-video bg-black">
                            <iframe
                                className="absolute inset-0 h-full w-full"
                                src={`https://www.youtube.com/embed/${appearances.find(a => a.id === activeVideo)?.youtubeId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
                                title="Video destacado"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                        <div className="flex items-center justify-between bg-zinc-900 px-4 py-3 border-t border-zinc-800">
                            <p className="text-xs font-semibold text-white line-clamp-1 max-w-lg">
                                {appearances.find(a => a.id === activeVideo)?.title}
                            </p>
                            <button
                                onClick={() => setActiveVideo(null)}
                                className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors ml-4 shrink-0"
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
                                className={`group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 ${
                                    isActive
                                        ? "border-blue-500/40 bg-blue-950/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                                        : isHovered
                                        ? "border-zinc-600 bg-zinc-800/60 -translate-y-1 shadow-2xl"
                                        : "border-zinc-800/60 bg-zinc-900/40"
                                }`}
                                onMouseEnter={() => setHoveredId(item.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => setActiveVideo(item.id)}
                            >
                                {/* Thumbnail / Preview Area */}
                                <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${item.color} bg-zinc-900`}>
                                    <img
                                        src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`}
                                        alt={item.title}
                                        className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                                    />
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />

                                    {/* Play button */}
                                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered || isActive ? "opacity-100" : "opacity-0"}`}>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-xl ring-2 ring-white/20 transition-transform duration-300 group-hover:scale-110">
                                            <PlayCircle className="h-5 w-5 text-zinc-900 fill-zinc-900" />
                                        </div>
                                    </div>

                                    {/* Badge */}
                                    <div className="absolute top-2 left-2">
                                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm ${item.badgeColor}`}>
                                            <Icon className="h-2.5 w-2.5" />
                                            {item.badge}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-3.5">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500 mb-1">
                                        {item.channel}
                                    </p>
                                    <h3 className="text-sm font-semibold leading-snug text-white line-clamp-2 group-hover:text-zinc-100 transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors">
                                        <PlayCircle className="h-3 w-3" />
                                        Ver aquí
                                    </div>
                                </div>

                                {/* Active indicator strip */}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                                )}
                            </MotionDiv>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
