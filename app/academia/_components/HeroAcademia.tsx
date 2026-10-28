import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Portada de la Academia con el mismo sistema que el resto del CRC: serif
 * sobria, cobre solo en la acción principal, filetes en vez de tarjetas.
 * Reemplaza el carrusel de retratos de filósofos sobre fondo negro, que hacía
 * ver a la Academia como otra marca.
 */

const FORMATO = [
    ["Formato", "Clases grabadas, a tu ritmo, con material de profundización."],
    ["Quién enseña", "Académicos e investigadores del equipo del CRC."],
    ["Al terminar", "Certificado del CRC, descargable y verificable."],
] as const;

export function HeroAcademia() {
    return (
        <section className="border-b" style={{ borderColor: "var(--ac-border-md)" }}>
            <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16 lg:px-12 lg:py-24">
                <div>
                    <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Academia CRC</p>
                    <h1 className="crc-serif mt-4 max-w-[24ch] text-balance text-[clamp(2rem,3.2vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.01em] text-[#171713]">
                        Cursos para quienes trabajan con niñez, salud mental y protección de derechos.
                    </h1>
                    <p className="mt-6 max-w-[60ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">
                        Formación del Centro de Reflexiones Críticas para duplas psicosociales, docentes, equipos de programas y
                        profesionales de la salud. Teoría crítica aplicada a los casos que llegan cada semana.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                        <Link
                            href="#catalogo"
                            className="group inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-[#bd6f3c] px-5 py-2.5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f5ee]"
                        >
                            Ver cursos
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>
                        <Link
                            href="/academia/login"
                            className="inline-flex min-h-11 items-center text-[0.9375rem] font-semibold text-[#171713] underline decoration-[#bd6f3c] underline-offset-[6px] transition-colors hover:text-[#9f5528]"
                        >
                            Crear cuenta o iniciar sesión
                        </Link>
                    </div>
                </div>

                <dl className="border-t border-[#d8cfc0]">
                    {FORMATO.map(([term, detail]) => (
                        <div key={term} className="grid gap-1 border-b border-[#d8cfc0] py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
                            <dt className="text-[0.875rem] font-semibold text-[#171713]">{term}</dt>
                            <dd className="text-[0.9375rem] leading-[1.6] text-[#55574f]">{detail}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
