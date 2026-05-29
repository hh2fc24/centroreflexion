import { Quote } from "lucide-react";

interface Testimonio {
    texto: string;
    autor: string;
    contexto: string;
}

interface TestimonialsSectionProps {
    testimonios: Testimonio[];
    titulo?: string;
}

export function TestimonialsSection({
    testimonios,
    titulo = "Lo que dicen quienes trabajaron con nosotros",
}: TestimonialsSectionProps) {
    return (
        <section className="border-t border-[#eee8dc] bg-[#f8f5ee] py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 max-w-2xl">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Testimonios</span>
                    <h2 className="mt-3 text-3xl font-bold leading-tight text-[#171713] font-serif">{titulo}</h2>
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {testimonios.map((t, i) => (
                        <article
                            key={i}
                            className="flex flex-col rounded-[8px] border border-[#ded5c7] bg-[#fffdf8] p-6 shadow-sm"
                        >
                            <Quote className="mb-4 h-6 w-6 shrink-0 text-[#bd6f3c] opacity-60" />
                            <p className="flex-1 text-sm leading-7 text-[#55574f] font-serif italic">
                                &ldquo;{t.texto}&rdquo;
                            </p>
                            <div className="mt-5 border-t border-[#eee8dc] pt-4">
                                <p className="text-sm font-bold text-[#171713]">{t.autor}</p>
                                <p className="mt-0.5 text-xs text-[#8a8276]">{t.contexto}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
