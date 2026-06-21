"use client";

import { MotionDiv } from "@/components/ui/Motion";
import { ArrowRight, BookOpen, ExternalLink, LibraryBig, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const books = [
    {
        title: "Tecnócratas de la Infancia",
        subtitle: "Desprotección y neoliberalismo en Chile",
        author: "Juan Carlos Rauld",
        year: "2026",
        image: "/images/tecnocratas-evento-uah.jpeg",
        href: "https://www.editorialhammurabi.com/shop/colecciones-hammurabi/tecnocratas-de-la-infancia/",
        tag: "Último lanzamiento",
        summary:
            "Crítica a la racionalidad tecnocrática que administra la infancia pobre y normaliza la desprotección estatal.",
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
            "Genealogía de la institucionalización infantil en Chile y sus vínculos con gobierno, clase y disciplina.",
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
            "Aproximación clínica y ética a trauma, hospitalización, institucionalización y sufrimiento infantil.",
        points: ["Salud mental", "Trauma", "Clínica infantil"],
        quote: "Pensar la salud mental infantil exige mirar también las instituciones que producen sufrimiento.",
    },
];

export function PublicationsSection() {
    return (
        <>
            <section className="bg-[#171713] text-white">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:px-8">
                    <MotionDiv
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 rounded-[6px] border border-white/12 bg-white/[0.06] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#f1ded0]">
                            <BookOpen className="h-3.5 w-3.5 text-[#d3976d]" />
                            Publicaciones CRC
                        </div>
                        <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.04] text-white sm:text-5xl lg:text-6xl">
                            Libros, lanzamientos y debate público.
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-8 text-[#d8d0c4]">
                            Una selección editorial sobre infancia, salud mental, instituciones y políticas públicas,
                            organizada para leer rápido y actuar sin rodeos.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <a
                                href="#catalogo-editorial"
                                className="group inline-flex items-center justify-center gap-2 rounded-[7px] bg-[#bd6f3c] px-5 py-3 text-sm font-bold text-white transition duration-200 hover:bg-[#9f5528]"
                            >
                                Ver catálogo
                                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </a>
                            <Link
                                href="/contacto"
                                className="inline-flex items-center justify-center rounded-[7px] border border-white/14 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition duration-200 hover:bg-white/[0.1]"
                            >
                                Agenda de atención
                            </Link>
                        </div>
                    </MotionDiv>

                    <MotionDiv
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        className="grid gap-3 sm:grid-cols-3 lg:justify-self-end"
                    >
                        {[
                            ["3", "libros"],
                            ["1", "lanzamiento"],
                            ["7+", "medios"],
                        ].map(([value, label]) => (
                            <div key={label} className="min-w-[150px] rounded-[8px] border border-white/10 bg-white/[0.045] p-4">
                                <p className="font-serif text-3xl font-bold text-white">{value}</p>
                                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#c9b9aa]">{label}</p>
                            </div>
                        ))}
                    </MotionDiv>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] bg-[#fffdf8]">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row lg:px-8">
                    {[
                        ["Catálogo", "#catalogo-editorial", LibraryBig],
                        ["Lanzamiento", "#catalogo-editorial", BookOpen],
                        ["Medios", "#medios-publicaciones", PlayCircle],
                    ].map(([label, href, Icon]) => {
                        const NavIcon = Icon as typeof LibraryBig;
                        return (
                            <a
                                key={label as string}
                                href={href as string}
                                className="group inline-flex items-center justify-between gap-4 rounded-[7px] border border-[#ded5c7] bg-[#fffdf8] px-4 py-3 text-sm font-bold text-[#171713] transition duration-200 hover:border-[#bd6f3c]/50 hover:bg-[#f8f5ee]"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <NavIcon className="h-4 w-4 text-[#bd6f3c]" />
                                    {label as string}
                                </span>
                                <ArrowRight className="h-4 w-4 text-[#bd6f3c] transition-transform duration-200 group-hover:translate-x-0.5" />
                            </a>
                        );
                    })}
                </div>
            </section>

            <section id="catalogo-editorial" className="bg-[#f8f5ee] py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 border-b border-[#ded5c7] pb-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">
                                Catálogo editorial
                            </span>
                            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#171713] sm:text-4xl">
                                Obras centrales
                            </h2>
                        </div>
                        <p className="max-w-2xl text-sm leading-7 text-[#70695f]">
                            Títulos publicados y piezas de lanzamiento. Menos vitrina ornamental, más información útil.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-5 lg:grid-cols-3">
                        {books.map((book, index) => (
                            <MotionDiv
                                key={book.title}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                                className="flex h-full flex-col rounded-[8px] border border-[#ded5c7] bg-[#fffdf8] p-5 shadow-sm transition duration-200 hover:border-[#bd6f3c]/45 hover:shadow-[0_12px_26px_rgba(31,27,22,0.08)]"
                            >
                                <div className="rounded-[7px] bg-[#171713] p-3">
                                    <div className="relative mx-auto aspect-[4/5] w-full max-w-[190px] overflow-hidden rounded-[6px] bg-[#0f0d0a]">
                                        <Image
                                            src={book.image}
                                            alt={`Portada o afiche de ${book.title}`}
                                            fill
                                            sizes="220px"
                                            className="object-contain"
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-wrap items-center gap-2">
                                    <span className="rounded-[5px] bg-[#ecd8c7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9f5528]">
                                        {book.tag}
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a8175]">
                                        {book.author} · {book.year}
                                    </span>
                                </div>
                                <h3 className="mt-4 font-serif text-2xl font-bold leading-tight text-[#171713]">
                                    {book.title}
                                </h3>
                                <p className="mt-2 min-h-12 text-base font-semibold leading-6 text-[#bd6f3c]">{book.subtitle}</p>
                                <p className="mt-4 text-sm leading-7 text-[#70695f]">{book.summary}</p>

                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {book.points.map((point) => (
                                        <span
                                            key={point}
                                            className="rounded-[5px] border border-[#ded5c7] bg-[#f8f5ee] px-2 py-0.5 text-[11px] font-semibold text-[#625c52]"
                                        >
                                            {point}
                                        </span>
                                    ))}
                                </div>

                                {book.title === "Tecnócratas de la Infancia" ? (
                                    <div className="mt-4 grid gap-1.5 text-[11px] font-semibold text-[#625c52]">
                                        <span className="rounded-[5px] border border-[#ded5c7] bg-[#f8f5ee] px-2.5 py-1">
                                            Editorial Hammurabi
                                        </span>
                                        <span className="rounded-[5px] border border-[#ded5c7] bg-[#f8f5ee] px-2.5 py-1">
                                            Lanzamiento UAH · registro audiovisual
                                        </span>
                                    </div>
                                ) : null}

                                <details className="mt-4 text-sm text-[#70695f]">
                                    <summary className="cursor-pointer list-none font-bold text-[#171713] marker:hidden">
                                        Ver cita
                                    </summary>
                                    <p className="mt-2 border-l-2 border-[#bd6f3c] pl-3 italic leading-6">
                                        {book.quote}
                                    </p>
                                </details>

                                {book.title === "Tecnócratas de la Infancia" ? (
                                    <details className="mt-3 rounded-[7px] border border-[#ded5c7] bg-[#fffdf8] px-3 py-2 text-sm text-[#70695f]">
                                        <summary className="cursor-pointer list-none font-bold text-[#171713] marker:hidden">
                                            Ver registro audiovisual
                                        </summary>
                                        <video
                                            className="mt-3 aspect-[9/16] w-full max-w-[140px] rounded-[6px] bg-black object-cover"
                                            controls
                                            preload="metadata"
                                            poster="/images/tecnocratas_abstract_1771965880554.png"
                                            aria-label="Presentación audiovisual del libro Tecnócratas de la Infancia"
                                        >
                                            <source src="/videos/tecnocratas-lanzamiento.mp4" type="video/mp4" />
                                            Tu navegador no soporta el elemento de video.
                                        </video>
                                    </details>
                                ) : null}

                                <a
                                    href={book.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-[#171713] transition hover:text-[#bd6f3c]"
                                >
                                    Comprar
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            </MotionDiv>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
