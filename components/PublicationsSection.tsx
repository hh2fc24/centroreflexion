import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { books } from "@/lib/books";

/**
 * Catálogo de libros con portadas reales (docs/design-system-crc.md §4).
 * Sin animación ni decoración: portada, ficha y enlace a Editorial Hammurabi.
 */
export function PublicationsSection() {
    return (
        <>
            <header className="border-b border-[#d8cfc0] bg-[#fffdf8]">
                <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
                    <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Publicaciones del CRC</p>
                    <h1 className="crc-serif mt-3 max-w-[22ch] text-balance text-[clamp(2rem,3.2vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-[#171713]">
                        Libros y presencia en medios
                    </h1>
                    <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">
                        Los libros de Juan Carlos Rauld con Editorial Hammurabi sobre infancia, salud mental e
                        instituciones, y sus entrevistas y apariciones en medios.
                    </p>
                    <nav aria-label="En esta página" className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] font-semibold">
                        <a href="#catalogo-editorial" className="text-[#171713] underline decoration-[#bd6f3c] underline-offset-4 hover:text-[#9f5528]">
                            Libros
                        </a>
                        <a href="#medios-publicaciones" className="text-[#171713] underline decoration-[#bd6f3c] underline-offset-4 hover:text-[#9f5528]">
                            En los medios
                        </a>
                    </nav>
                </div>
            </header>

            <section id="catalogo-editorial" aria-labelledby="libros-titulo" className="scroll-mt-20 bg-[#f8f5ee] py-14 sm:py-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-8">
                    <h2
                        id="libros-titulo"
                        className="crc-serif border-b border-[#d8cfc0] pb-4 text-[clamp(1.6rem,2.3vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-[#171713]"
                    >
                        Libros
                    </h2>

                    <ol>
                        {books.map((book, index) => {
                            const isTecnocratas = book.title === "Tecnócratas de la Infancia";
                            return (
                                <li key={book.title} className="border-b border-[#d8cfc0] py-10">
                                    <article className="grid gap-6 sm:grid-cols-[10rem_1fr] sm:gap-10 lg:grid-cols-[12rem_1fr_16rem]">
                                        <a
                                            href={book.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            tabIndex={-1}
                                            aria-hidden="true"
                                            className="block w-36 sm:w-auto"
                                        >
                                            <div className="relative aspect-[2/3] overflow-hidden rounded-[6px] border border-[#d8cfc0] bg-[#fffdf8]">
                                                <Image
                                                    src={book.image}
                                                    alt=""
                                                    fill
                                                    priority={index === 0}
                                                    sizes="(min-width: 1024px) 192px, 160px"
                                                    className="object-cover"
                                                />
                                            </div>
                                        </a>

                                        <div>
                                            <p className="text-[0.8125rem] font-semibold text-[#9f5528]">
                                                {book.tag} · <span className="tabular-nums">{book.year}</span>
                                            </p>
                                            <h3 className="crc-serif mt-2 text-balance text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.01em] text-[#171713] sm:text-[1.6rem]">
                                                {book.title}
                                            </h3>
                                            <p className="mt-1 text-[1.0625rem] text-[#55574f]">{book.subtitle}</p>
                                            <p className="mt-4 max-w-[62ch] text-[1rem] leading-[1.7] text-[#55574f]">{book.summary}</p>
                                            <p className="mt-3 text-[0.9375rem] text-[#6f675d]">
                                                {book.author} · Editorial Hammurabi · {book.points.join(", ")}
                                            </p>
                                            <a
                                                href={book.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#bd6f3c] px-5 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31] sm:w-auto"
                                            >
                                                Ver en Editorial Hammurabi
                                                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                            </a>
                                        </div>

                                        <div className="sm:col-span-2 lg:col-span-1">
                                            <blockquote className="border-l-2 border-[#bd6f3c] pl-4 crc-serif text-[1.0625rem] leading-[1.5] text-[#171713]">
                                                {book.quote}
                                            </blockquote>
                                            {isTecnocratas ? (
                                                <details className="mt-6 rounded-[6px] border border-[#d8cfc0] bg-[#fffdf8] px-4 py-3">
                                                    <summary className="cursor-pointer text-[0.9375rem] font-semibold text-[#171713]">
                                                        Lanzamiento en la UAH (video)
                                                    </summary>
                                                    <video
                                                        className="mt-3 aspect-[9/16] w-full max-w-[180px] rounded-[6px] bg-[#15120e] object-cover"
                                                        controls
                                                        preload="none"
                                                        playsInline
                                                        poster="/images/tecnocratas-evento-uah.jpeg"
                                                        aria-label="Registro del lanzamiento de Tecnócratas de la Infancia en la Universidad Alberto Hurtado"
                                                    >
                                                        <source src="/videos/tecnocratas-lanzamiento.mp4" type="video/mp4" />
                                                        Tu navegador no reproduce este video.
                                                    </video>
                                                </details>
                                            ) : null}
                                        </div>
                                    </article>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </section>
        </>
    );
}
