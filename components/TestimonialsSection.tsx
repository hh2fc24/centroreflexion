interface Testimonio {
    texto: string;
    autor: string;
    contexto: string;
}

interface TestimonialsSectionProps {
    testimonios: Testimonio[];
    titulo?: string;
}

/** Testimonios con nombre y contexto, en lista editorial con filetes. Solo lo usa /servicios/clinica. */
export function TestimonialsSection({
    testimonios,
    titulo = "Lo que dicen quienes trabajaron con nosotros",
}: TestimonialsSectionProps) {
    return (
        <section aria-labelledby="testimonios-title" className="border-t border-[#d8cfc0] bg-[#f8f5ee]">
            <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <div className="max-w-[46rem]">
                    <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Testimonios</p>
                    <h2
                        id="testimonios-title"
                        className="crc-serif mt-3 text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-[#171713] text-balance"
                    >
                        {titulo}
                    </h2>
                </div>
                <ul className="mt-12 grid border-t border-[#d8cfc0] md:grid-cols-2 md:gap-x-12">
                    {testimonios.map((t) => (
                        <li key={t.autor} className="border-b border-[#d8cfc0] py-7">
                            <figure>
                                <blockquote className="crc-serif text-[1.125rem] leading-[1.55] text-[#171713]">
                                    &ldquo;{t.texto}&rdquo;
                                </blockquote>
                                <figcaption className="mt-4 text-[0.9375rem]">
                                    <span className="font-semibold text-[#171713]">{t.autor}</span>
                                    <span className="text-[#6f675d]"> · {t.contexto}</span>
                                </figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
