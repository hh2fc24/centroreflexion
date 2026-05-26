"use client";

import { MotionDiv } from "@/components/ui/Motion";
import { Calendar, ExternalLink, Mic2, Newspaper, PlayCircle, Quote, Radio, Tv2 } from "lucide-react";
import { useState } from "react";

const featuredArticle = {
    url: "https://www.elmostrador.cl/agenda-pais/ninez/2026/04/05/juan-carlos-rauld-el-estado-desprotege-es-una-intervencion-cara-con-malos-resultados/",
    title: "Juan Carlos Rauld: “El Estado desprotege. Es una intervención cara con malos resultados”",
    channel: "El Mostrador",
    date: "5 abril, 2026",
    section: "Agenda País · Niñez",
    excerpt: "Entrevista sobre la crisis estructural del sistema de protección de infancias en Chile, la sobreintervención institucional y el desplazamiento del cuidado por la gestión tecnocrática.",
    quote: "El Estado desprotege. Es una intervención cara con malos resultados.",
    image: "https://media-front.elmostrador.cl/2026/03/Editar-Imagenes-3-13-700x350.png",
};

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
    const activeVideoItem = appearances.find((item) => item.id === activeVideo);

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

                <MotionDiv
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 overflow-hidden rounded-[8px] border border-[#4b4e45]/80 bg-[#172017]/70 shadow-[0_28px_90px_-56px_rgba(189,111,60,0.58)] sm:mb-10 lg:grid lg:grid-cols-[0.9fr_1.1fr]"
                >
                    <a
                        href={featuredArticle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block min-h-[260px] overflow-hidden bg-[#0f0d0a] sm:min-h-[320px] lg:min-h-full"
                        aria-label={`Leer entrevista en ${featuredArticle.channel}: ${featuredArticle.title}`}
                    >
                        <img
                            src={featuredArticle.image}
                            alt={featuredArticle.title}
                            className="absolute inset-0 h-full w-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#172017] via-[#172017]/35 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#172017]" />
                        <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center gap-1 rounded-[5px] border border-[#bd6f3c]/70 bg-[#9f5528]/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f1ded0] backdrop-blur-sm">
                                <Newspaper className="h-3 w-3" />
                                Entrevista escrita
                            </span>
                        </div>
                        <div className="absolute right-4 bottom-4 flex h-11 w-11 items-center justify-center rounded-[5px] bg-[#fffdf8]/95 shadow-md ring-1 ring-white/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                            <ExternalLink className="h-5 w-5 text-[#171713]" />
                        </div>
                    </a>

                    <div className="p-5 sm:p-8 lg:p-10">
                        <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a99f91]">
                            <span>{featuredArticle.channel}</span>
                            <span className="h-1 w-1 rounded-full bg-[#70695f]" />
                            <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {featuredArticle.date}
                            </span>
                        </div>
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#d3976d]">
                            {featuredArticle.section}
                        </p>
                        <h3 className="max-w-3xl text-2xl font-bold leading-tight text-white font-serif sm:text-3xl">
                            {featuredArticle.title}
                        </h3>
                        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#a99f91] sm:text-base">
                            {featuredArticle.excerpt}
                        </p>
                        <div className="mt-6 rounded-[6px] border border-[#4b4e45]/80 bg-[#0f0d0a]/24 p-4">
                            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#70695f]">
                                <Quote className="h-3 w-3" />
                                Cita destacada
                            </div>
                            <p className="text-base font-medium leading-relaxed text-[#f1ded0]">
                                “{featuredArticle.quote}”
                            </p>
                        </div>
                        <a
                            href={featuredArticle.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#bd6f3c] px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-sm transition-all hover:translate-x-0.5 hover:bg-[#9f5528] sm:w-auto"
                        >
                            Leer en El Mostrador
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                </MotionDiv>

                {/* Active Video Player */}
                {activeVideoItem ? (
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
                                src={`https://www.youtube.com/embed/${activeVideoItem.youtubeId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
                                title="Video destacado"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                        <div className="flex items-center justify-between bg-[#172017] px-4 py-3 border-t border-[#34362f]">
                            <p className="text-xs font-semibold text-white line-clamp-1 max-w-lg">
                                {activeVideoItem.title}
                            </p>
                            <button
                                onClick={() => setActiveVideo(null)}
                                className="text-[10px] font-bold uppercase tracking-widest text-[#70695f] hover:text-[#d8d0c4] transition-colors ml-4 shrink-0"
                            >
                                Cerrar ✕
                            </button>
                        </div>
                    </MotionDiv>
                ) : null}

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
