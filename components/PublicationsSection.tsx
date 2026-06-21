"use client";

import { MotionDiv } from "@/components/ui/Motion";
import {
    ArrowRight,
    BookOpen,
    CalendarDays,
    ExternalLink,
    LibraryBig,
    Newspaper,
    PlayCircle,
    Quote,
    Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type PublicationTeaser = {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    image: string;
    href: string;
};

const books = [
    {
        title: "Tecnócratas de la Infancia",
        subtitle: "Desprotección y neoliberalismo en Chile",
        author: "Juan Carlos Rauld",
        year: "2026",
        image: "/images/tecnocratas_infancia_real.jpg",
        href: "https://www.editorialhammurabi.com/shop/colecciones-hammurabi/tecnocratas-de-la-infancia/",
        tag: "Último lanzamiento",
        summary:
            "Una crítica a la racionalidad tecnocrática que administra la infancia pobre y normaliza la desprotección estatal.",
        points: ["Infancia y Estado", "Neoliberalismo", "Cuidado alternativo"],
        quote: "La infancia no puede ser reducida a expediente, protocolo o indicador.",
    },
    {
        title: "Desprotección de la Infancia",
        subtitle: "Dominación, biopolítica y gobierno",
        author: "Juan Carlos Rauld",
        year: "2021",
        image: "/images/book_desproteccion.png",
        href: "https://www.editorialhammurabi.com/shop/derecho/privado/derecho-civil/derecho-familiar/desproteccion-de-la-infancia/",
        tag: "Libro",
        summary:
            "Un examen genealógico de la institucionalización infantil en Chile y sus vínculos con gobierno, clase y disciplina.",
        points: ["Biopolítica", "Institucionalización", "Derecho de familia"],
        quote: "Una lectura crítica sobre el poder que se ejerce sobre la vida del niño.",
    },
    {
        title: "Perspectivas Críticas de la Salud Mental Infantil",
        subtitle: "Trauma, institucionalización y suplicio",
        author: "Juan Carlos Rauld",
        year: "2022",
        image: "/images/book_perspectivas.png",
        href: "https://www.editorialhammurabi.com/shop/derecho/privado/derecho-civil/derecho-familiar/desproteccion-de-la-infancia/",
        tag: "Libro",
        summary:
            "Una aproximación clínica y ética a trauma, hospitalización, institucionalización y sufrimiento infantil.",
        points: ["Salud mental", "Trauma", "Clínica infantil"],
        quote: "Pensar la salud mental infantil exige mirar también las instituciones que producen sufrimiento.",
    },
];

const editorialRoutes = [
    {
        label: "Libros",
        description: "Obras publicadas para profundizar en infancia, institucionalización y salud mental.",
        href: "#catalogo-editorial",
        icon: LibraryBig,
    },
    {
        label: "Columnas y ensayos",
        description: "Textos recientes para leer el presente desde una perspectiva crítica.",
        href: "#publicaciones-recientes",
        icon: Newspaper,
    },
    {
        label: "Medios",
        description: "Entrevistas, presentaciones y debates públicos que amplifican la conversación.",
        href: "#medios-publicaciones",
        icon: PlayCircle,
    },
];

function readingMinutes(article: PublicationTeaser) {
    const words = `${article.title} ${article.excerpt}`.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.ceil((words + 650) / 220));
}

export function PublicationsSection({
    latestArticles = [],
    articleCount = latestArticles.length,
}: {
    latestArticles?: PublicationTeaser[];
    articleCount?: number;
}) {
    const featuredArticle = latestArticles[0] ?? null;
    const secondaryArticles = latestArticles.slice(1, 6);

    return (
        <>
            <section className="relative min-h-[680px] overflow-hidden bg-[#171713] text-white">
                <Image
                    src="/images/hero_crc_library.jpg"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover opacity-[0.54]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#171713] via-[#171713]/84 to-[#171713]/28" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171713] via-transparent to-[#171713]/20" />

                <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl flex-col justify-end px-4 pb-12 pt-28 sm:px-6 sm:pb-16 lg:px-8">
                    <MotionDiv
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 rounded-[6px] border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#f1ded0] backdrop-blur">
                            <BookOpen className="h-3.5 w-3.5 text-[#d3976d]" />
                            Publicaciones CRC
                        </div>
                        <h1 className="mt-6 max-w-4xl font-serif text-4xl font-bold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
                            Ideas, libros y debate público para pensar la infancia.
                        </h1>
                        <p className="mt-6 max-w-2xl text-base leading-8 text-[#eee8dc] sm:text-lg">
                            Una biblioteca viva de libros, columnas, entrevistas y piezas editoriales sobre infancia,
                            salud mental, instituciones y políticas públicas.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <a
                                href="#catalogo-editorial"
                                className="group inline-flex items-center justify-center gap-2 rounded-[7px] bg-[#bd6f3c] px-5 py-3 text-sm font-bold text-white transition duration-200 hover:bg-[#9f5528]"
                            >
                                Explorar publicaciones
                                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </a>
                            <Link
                                href="/contacto"
                                className="inline-flex items-center justify-center gap-2 rounded-[7px] border border-white/16 bg-white/8 px-5 py-3 text-sm font-bold text-white backdrop-blur transition duration-200 hover:bg-white/14"
                            >
                                Agenda de atención
                            </Link>
                        </div>
                    </MotionDiv>

                    <div className="mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
                        {[
                            ["3", "libros publicados"],
                            [String(articleCount), "textos disponibles"],
                            ["7+", "apariciones en medios"],
                        ].map(([value, label]) => (
                            <div key={label} className="border-l border-white/16 pl-4">
                                <p className="font-serif text-3xl font-bold text-white">{value}</p>
                                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#c9b9aa]">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] bg-[#fffdf8] py-10">
                <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
                    {editorialRoutes.map((route) => {
                        const Icon = route.icon;
                        return (
                            <a
                                key={route.label}
                                href={route.href}
                                className="group flex min-h-[150px] flex-col justify-between rounded-[8px] border border-[#ded5c7] bg-[#fffdf8] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#bd6f3c]/50 hover:shadow-[0_16px_34px_rgba(31,27,22,0.08)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-[7px] bg-[#171713] text-[#d3976d] transition duration-300 group-hover:bg-[#bd6f3c] group-hover:text-white">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-[#bd6f3c] transition-transform duration-200 group-hover:translate-x-0.5" />
                                </div>
                                <div className="mt-5">
                                    <h2 className="font-serif text-2xl font-bold text-[#171713]">{route.label}</h2>
                                    <p className="mt-2 text-sm leading-6 text-[#70695f]">{route.description}</p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </section>

            <section id="catalogo-editorial" className="bg-[#f8f5ee] py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">
                                Catálogo editorial
                            </span>
                            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#171713] sm:text-4xl">
                                Libros que instalan una posición crítica.
                            </h2>
                        </div>
                        <p className="max-w-3xl text-base leading-7 text-[#70695f] lg:justify-self-end">
                            En vez de presentar los libros como una lista, los mostramos como productos intelectuales:
                            tema, utilidad, autoridad y acción de compra en una sola lectura.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 lg:grid-cols-3">
                        {books.map((book, index) => (
                            <MotionDiv
                                key={book.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.55, delay: index * 0.08 }}
                                className="group flex h-full flex-col rounded-[8px] border border-[#ded5c7] bg-[#fffdf8] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#bd6f3c]/45 hover:shadow-[0_22px_46px_rgba(31,27,22,0.1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                            >
                                <div className="flex items-start gap-5">
                                    <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-[7px] bg-[#eee8dc] shadow-[0_16px_30px_rgba(31,27,22,0.12)] sm:w-32">
                                        <Image
                                            src={book.image}
                                            alt={`Portada de ${book.title}`}
                                            fill
                                            sizes="160px"
                                            className="object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="inline-flex items-center rounded-[5px] bg-[#ecd8c7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9f5528]">
                                            {book.tag}
                                        </span>
                                        <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-[#171713]">
                                            {book.title}
                                        </h3>
                                        <p className="mt-1 text-sm font-semibold text-[#bd6f3c]">{book.subtitle}</p>
                                    </div>
                                </div>

                                <p className="mt-5 text-sm leading-7 text-[#625c52]">{book.summary}</p>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    {book.points.map((point) => (
                                        <span
                                            key={point}
                                            className="rounded-[5px] border border-[#ded5c7] bg-[#f8f5ee] px-2.5 py-1 text-xs font-semibold text-[#625c52]"
                                        >
                                            {point}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-5 border-l-2 border-[#bd6f3c] pl-4">
                                    <Quote className="mb-2 h-4 w-4 text-[#bd6f3c]" />
                                    <p className="text-sm italic leading-6 text-[#70695f]">{book.quote}</p>
                                </div>

                                <div className="mt-auto flex flex-col gap-3 pt-6">
                                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-[#8a8175]">
                                        <span>{book.author}</span>
                                        <span>{book.year}</span>
                                    </div>
                                    <a
                                        href={book.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group/cta inline-flex items-center justify-center gap-2 rounded-[7px] bg-[#171713] px-5 py-3 text-sm font-bold text-white transition duration-200 hover:bg-[#34362f]"
                                    >
                                        Comprar libro
                                        <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                                    </a>
                                </div>
                            </MotionDiv>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#171713] py-14 text-white sm:py-20">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.78fr] lg:px-8">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-[6px] border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#f1ded0]">
                            <Sparkles className="h-3.5 w-3.5 text-[#d3976d]" />
                            Lanzamiento editorial
                        </span>
                        <h2 className="mt-5 max-w-3xl font-serif text-3xl font-bold leading-tight text-white sm:text-5xl">
                            Una obra para discutir el lenguaje técnico de la desprotección.
                        </h2>
                        <p className="mt-5 max-w-2xl text-base leading-8 text-[#c9b9aa]">
                            Tecnócratas de la Infancia articula una crítica sobre la gestión estatal, el daño institucional
                            y las formas en que la infancia pobre queda atrapada entre expediente, protocolo y administración.
                        </p>
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <a
                                href={books[0].href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center justify-center gap-2 rounded-[7px] bg-[#bd6f3c] px-5 py-3 text-sm font-bold text-white transition duration-200 hover:bg-[#9f5528]"
                            >
                                Comprar último libro
                                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </a>
                            <a
                                href="#medios-publicaciones"
                                className="inline-flex items-center justify-center gap-2 rounded-[7px] border border-white/14 bg-white/6 px-5 py-3 text-sm font-bold text-white transition duration-200 hover:bg-white/10"
                            >
                                Ver entrevistas
                            </a>
                        </div>
                    </div>

                    <MotionDiv
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65 }}
                        className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[#0f0d0a]"
                    >
                        <video
                            className="aspect-video w-full bg-black object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            poster="/images/tecnocratas_abstract_1771965880554.png"
                            aria-label="Pieza audiovisual del libro Tecnócratas de la Infancia"
                        >
                            <source src="/videos/tecnocratas-lanzamiento.mp4" type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                        </video>
                        <div className="border-t border-white/10 p-4">
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d3976d]">Pieza audiovisual</p>
                            <p className="mt-2 text-sm leading-6 text-[#c9b9aa]">
                                Una entrada breve al tono y los problemas centrales de la obra.
                            </p>
                        </div>
                    </MotionDiv>
                </div>
            </section>

            <section id="publicaciones-recientes" className="bg-[#fffdf8] py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 border-b border-[#ded5c7] pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">
                                Lectura reciente
                            </span>
                            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#171713] sm:text-4xl">
                                Pensamiento activo, no archivo estático.
                            </h2>
                        </div>
                        <Link
                            href="/pensamiento-critico"
                            className="group inline-flex items-center gap-2 text-sm font-bold text-[#171713] transition hover:text-[#bd6f3c]"
                        >
                            Ver todas las publicaciones
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Link>
                    </div>

                    {featuredArticle ? (
                        <div className="mt-10 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
                            <a
                                href={featuredArticle.href}
                                className="group relative min-h-[420px] overflow-hidden rounded-[8px] bg-[#171713]"
                            >
                                <Image
                                    src={featuredArticle.image}
                                    alt={featuredArticle.title}
                                    fill
                                    sizes="(min-width: 1024px) 55vw, 100vw"
                                    className="object-cover opacity-84 transition duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#171713] via-[#171713]/54 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                                    <span className="inline-flex rounded-[5px] bg-[#bd6f3c] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                                        Destacado
                                    </span>
                                    <h3 className="mt-4 max-w-3xl font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">
                                        {featuredArticle.title}
                                    </h3>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#eee8dc]">{featuredArticle.excerpt}</p>
                                    <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.13em] text-[#c9b9aa]">
                                        <span>{featuredArticle.author}</span>
                                        <span className="h-1 w-1 rounded-full bg-[#d3976d]" />
                                        <span>{featuredArticle.category}</span>
                                        <span className="h-1 w-1 rounded-full bg-[#d3976d]" />
                                        <span>{readingMinutes(featuredArticle)} min</span>
                                    </div>
                                </div>
                            </a>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                                {secondaryArticles.slice(0, 3).map((article) => (
                                    <a
                                        key={article.id}
                                        href={article.href}
                                        className="group grid grid-cols-[92px_1fr] gap-4 rounded-[8px] border border-[#ded5c7] bg-[#fffdf8] p-3 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#bd6f3c]/45 hover:shadow-[0_14px_30px_rgba(31,27,22,0.08)]"
                                    >
                                        <div className="relative min-h-28 overflow-hidden rounded-[7px] bg-[#eee8dc]">
                                            <Image
                                                src={article.image}
                                                alt={article.title}
                                                fill
                                                sizes="120px"
                                                className="object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#bd6f3c]">
                                                {article.category}
                                            </p>
                                            <h3 className="mt-2 line-clamp-2 font-serif text-xl font-bold leading-tight text-[#171713]">
                                                {article.title}
                                            </h3>
                                            <div className="mt-3 flex items-center gap-2 text-xs text-[#70695f]">
                                                <CalendarDays className="h-3.5 w-3.5" />
                                                {article.date}
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {secondaryArticles.length > 3 ? (
                        <div className="mt-5 grid gap-4 md:grid-cols-3">
                            {secondaryArticles.slice(3).map((article) => (
                                <a
                                    key={article.id}
                                    href={article.href}
                                    className="group rounded-[8px] border border-[#ded5c7] bg-[#fffdf8] p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#bd6f3c]/45 hover:shadow-[0_14px_30px_rgba(31,27,22,0.08)]"
                                >
                                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#bd6f3c]">
                                        {article.category}
                                    </p>
                                    <h3 className="mt-3 line-clamp-2 font-serif text-xl font-bold leading-tight text-[#171713]">
                                        {article.title}
                                    </h3>
                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#70695f]">{article.excerpt}</p>
                                    <div className="mt-5 flex items-center justify-between gap-4 text-xs font-semibold text-[#8a8175]">
                                        <span>{article.author}</span>
                                        <span>{readingMinutes(article)} min</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>
        </>
    );
}
