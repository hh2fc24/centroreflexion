"use client";

import { ExternalLink, Play, X } from "lucide-react";
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

const contextualReport = {
    url: "https://www.elmostrador.cl/noticias/pais/2024/07/21/crisis-de-informacion-el-estado-no-sabe-cuantos-ninos-desaparecen-de-su-cuidado/",
    title: "Crisis de información: el Estado no sabe cuántos niños “desaparecen” de su cuidado",
    channel: "El Mostrador",
    date: "21 julio, 2024",
    section: "País · Protección especializada",
    excerpt:
        "Reportaje sobre la falta de datos unificados respecto de niños, niñas y adolescentes ausentes de residencias y el cierre de Red Calle Niños. Juan Carlos Rauld participó como coordinador regional metropolitano de la iniciativa, advirtiendo que la institucionalización puede profundizar la vida de la niñez en calle.",
    note:
        "Archivo relevante para la discusión pública actual en Chile: una problemática que Juan Carlos Rauld ya venía abordando desde la intervención especializada y la crítica institucional.",
};

interface AppearanceItem {
    id: number;
    youtubeId?: string;
    videoUrl?: string;
    imageUrl?: string;
    title: string;
    channel: string;
    badge: string;
    description?: string;
}

const appearances: AppearanceItem[] = [
    {
        id: 8,
        youtubeId: "cppUbVIMdVY",
        title: "Aparición de Juan Carlos Rauld",
        channel: "YouTube",
        badge: "Aparición en medios",
    },
    {
        id: 7,
        videoUrl: "/crc.mp4",
        imageUrl: "/images/juan-carlos-rauld-furia-del-libro.jpg",
        title: "Presentación en La Furia del Libro: Tecnócratas de la Infancia y la Crítica al Sistema",
        channel: "La Furia del Libro 2026",
        badge: "Presentación",
        description: "El Centro de Reflexiones Críticas estuvo presente en la versión invernal de La Furia del Libro 2026, celebrada en el Centro Cultural Estación Mapocho del 28 al 31 de mayo. A través de nuestro director, Juan Carlos Rauld, participamos activamente de este encuentro fundamental de la edición independiente chilena. En el marco del lanzamiento de su obra 'Tecnócratas de la Infancia' (Editorial Hammurabi), Rauld expuso y fue entrevistado en profundidad sobre el sistema de desprotección estatal, la biopolítica de la infancia pobre y el impacto del modelo neoliberal en los sistemas de cuidado alternativo.",
    },
    {
        id: 1,
        youtubeId: "c-xOCEXFCXU",
        title: "Niños y Salud Mental: Una Mirada Crítica",
        channel: "YouTube",
        badge: "Aparición en medios",
    },
    {
        id: 2,
        youtubeId: "nhjSIADQy5A",
        title: "Infancia, Institucionalización y Biopolítica",
        channel: "YouTube",
        badge: "Entrevista",
    },
    {
        id: 3,
        youtubeId: "7iXQ6jZ6o78",
        title: "Salud Mental Infantil y Neoliberalismo",
        channel: "YouTube",
        badge: "Análisis",
    },
    {
        id: 4,
        youtubeId: "bc42h4sMbc0",
        title: "Desprotección de la Infancia en Chile",
        channel: "YouTube",
        badge: "Debate",
    },
    {
        id: 5,
        youtubeId: "QvJ5Y3pJyrY",
        title: '"Tecnócratas de la Infancia: Desprotección y Neoliberalismo"',
        channel: "Extensión Línea Uno",
        badge: "Radio",
    },
    {
        id: 6,
        youtubeId: "9fFTnDS0b6M",
        title: '"Cuando un niño pobre en Chile entra a un centro de la infancia…"',
        channel: "Análisis en Profundidad",
        badge: "Entrevista",
    },
];

export function MediaAppearancesSection() {
    const [activeVideo, setActiveVideo] = useState<number | null>(null);
    const activeVideoItem = appearances.find((item) => item.id === activeVideo);

    return (
        <section aria-labelledby="medios-titulo" className="bg-[#15120e] py-14 text-[#f8f5ee] sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-8">
                <p className="text-[0.8125rem] font-semibold text-[#e4935d]">En los medios</p>
                <h2
                    id="medios-titulo"
                    className="crc-serif mt-3 max-w-[24ch] text-balance text-[clamp(1.6rem,2.3vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-[#fffdf8]"
                >
                    Entrevistas y apariciones de Juan Carlos Rauld
                </h2>
                <p className="mt-4 max-w-[62ch] text-[1rem] leading-[1.7] text-[#d8cfc0]">
                    Entrevistas, reportajes y debates sobre infancia, sistema de protección, salud mental infantil
                    y políticas públicas.
                </p>

                {/* Prensa escrita */}
                <div className="mt-10 grid gap-px overflow-hidden rounded-[6px] border border-[#f8f5ee]/12 bg-[#f8f5ee]/12 lg:grid-cols-2">
                    <article className="flex flex-col bg-[#15120e] p-6 sm:p-8">
                        <p className="text-[0.8125rem] font-semibold text-[#e4935d]">
                            Entrevista · {featuredArticle.channel}
                            <span className="font-normal text-[#d8cfc0]"> · {featuredArticle.date}</span>
                        </p>
                        <span aria-hidden="true" className="mt-4 block h-[2px] w-10 bg-[#e4935d]" />
                        <blockquote className="crc-serif mt-4 text-balance text-[1.5rem] font-semibold leading-[1.2] tracking-[-0.01em] text-[#fffdf8] sm:text-[1.75rem]">
                            “{featuredArticle.quote}”
                        </blockquote>
                        <p className="mt-4 max-w-[60ch] text-[0.9375rem] leading-[1.7] text-[#d8cfc0]">{featuredArticle.excerpt}</p>
                        <a
                            href={featuredArticle.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 self-start rounded-[6px] bg-[#bd6f3c] px-5 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31] sm:w-auto"
                        >
                            Leer en {featuredArticle.channel}
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                    </article>

                    <article className="flex flex-col bg-[#15120e] p-6 sm:p-8">
                        <p className="text-[0.8125rem] font-semibold text-[#e4935d]">
                            Reportaje · {contextualReport.channel}
                            <span className="font-normal text-[#d8cfc0]"> · {contextualReport.date}</span>
                        </p>
                        <span aria-hidden="true" className="mt-4 block h-[2px] w-10 bg-[#e4935d]" />
                        <h3 className="crc-serif mt-4 text-balance text-[1.35rem] font-semibold leading-[1.25] text-[#fffdf8] sm:text-[1.5rem]">
                            {contextualReport.title}
                        </h3>
                        <p className="mt-4 max-w-[60ch] text-[0.9375rem] leading-[1.7] text-[#d8cfc0]">{contextualReport.excerpt}</p>
                        <a
                            href={contextualReport.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-2 self-start text-[0.9375rem] font-semibold text-[#fffdf8] underline decoration-[#e4935d] underline-offset-4 hover:text-[#e4935d]"
                        >
                            Leer el reportaje
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                    </article>
                </div>

                {/* Reproductor: solo se carga cuando la persona elige un video */}
                {activeVideoItem ? (
                    <div className="mt-10 overflow-hidden rounded-[6px] border border-[#f8f5ee]/12">
                        <div className="relative aspect-video bg-black">
                            {activeVideoItem.videoUrl ? (
                                <video
                                    className="absolute inset-0 h-full w-full object-contain"
                                    src={activeVideoItem.videoUrl}
                                    poster={activeVideoItem.imageUrl}
                                    controls
                                    playsInline
                                    preload="none"
                                />
                            ) : (
                                <iframe
                                    className="absolute inset-0 h-full w-full"
                                    src={`https://www.youtube-nocookie.com/embed/${activeVideoItem.youtubeId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
                                    title={activeVideoItem.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            )}
                        </div>
                        <div className="flex items-start justify-between gap-4 p-5">
                            <div>
                                <p className="text-[0.8125rem] font-semibold text-[#e4935d]">
                                    {activeVideoItem.badge} · <span className="font-normal text-[#d8cfc0]">{activeVideoItem.channel}</span>
                                </p>
                                <h3 className="crc-serif mt-2 text-[1.25rem] font-semibold leading-[1.25] text-[#fffdf8]">
                                    {activeVideoItem.title}
                                </h3>
                                {activeVideoItem.description ? (
                                    <p className="mt-3 max-w-[65ch] text-[0.9375rem] leading-[1.7] text-[#d8cfc0]">
                                        {activeVideoItem.description}
                                    </p>
                                ) : null}
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveVideo(null)}
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-[6px] border border-[#f8f5ee]/25 px-3 py-1.5 text-[0.875rem] font-semibold text-[#d8cfc0] transition-colors hover:border-[#e4935d] hover:text-[#fffdf8]"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                                Cerrar
                            </button>
                        </div>
                    </div>
                ) : null}

                {/* Videos */}
                <h3 className="mt-14 border-b border-[#f8f5ee]/12 pb-3 text-[1rem] font-semibold text-[#fffdf8]">
                    Videos
                </h3>
                <ul className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                    {appearances.map((item) => {
                        const isActive = activeVideo === item.id;
                        return (
                            <li key={item.id}>
                                <button
                                    type="button"
                                    onClick={() => setActiveVideo(item.id)}
                                    aria-pressed={isActive}
                                    className="group block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-[#e4935d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15120e]"
                                >
                                    <span className={`relative block aspect-video overflow-hidden rounded-[6px] bg-[#171713] ${isActive ? "ring-2 ring-[#e4935d]" : ""}`}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.imageUrl || `https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`}
                                            alt=""
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                        />
                                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-[6px] bg-[#15120e]/85 px-2.5 py-1 text-[0.8125rem] font-semibold text-[#fffdf8]">
                                            <Play className="h-3.5 w-3.5" aria-hidden="true" />
                                            Ver
                                        </span>
                                    </span>
                                    <span className="mt-3 block text-[0.8125rem] font-semibold text-[#e4935d]">
                                        {item.badge} <span className="font-normal text-[#d8cfc0]">· {item.channel}</span>
                                    </span>
                                    <span className="mt-1 block text-[1rem] font-semibold leading-[1.4] text-[#fffdf8] group-hover:underline group-hover:decoration-[#e4935d] group-hover:underline-offset-4">
                                        {item.title}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
