import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Declaración pública sobre niñez migrante haitiana",
  description:
    "Declaración pública del Centro de Reflexiones Críticas sobre derechos de la niñez, niñez migrante haitiana y Ley 21.430.",
  alternates: {
    canonical: `${siteUrl}/declaracion-publica/ninez-migrante-haitiana`,
  },
  openGraph: {
    title: "Declaración pública | Niñez migrante haitiana",
    description:
      "Juan Carlos Rauld, director del Centro de Reflexiones Críticas, se pronuncia sobre la vulneración de derechos de niños, niñas y adolescentes en Chile.",
    url: `${siteUrl}/declaracion-publica/ninez-migrante-haitiana`,
    siteName: "CRC",
    locale: "es_CL",
    type: "article",
  },
};

const axes = [
  "Protección efectiva sin distinción de origen, nacionalidad o situación administrativa.",
  "Derecho a vivienda, salud mental, participación y acceso real a justicia.",
  "Responsabilidad ética, jurídica y política frente a todas las infancias.",
];

const FOCO = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bd6f3c]";
const ETIQUETA = "text-[0.8125rem] font-semibold text-[#9f5528]";
const CONTENEDOR = "mx-auto max-w-[1240px] px-4 sm:px-8 lg:px-12";

export default function DeclaracionNinezMigranteHaitianaPage() {
  return (
    <div className="bg-[#f8f5ee] text-[#171713]">
      <section className="border-b border-[#d8cfc0]">
        <div className={`${CONTENEDOR} grid gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center lg:gap-16 lg:py-20`}>
          <div className="max-w-[680px]">
            <Link
              href="/"
              className={`inline-flex items-center gap-2 rounded-[6px] text-[0.9375rem] font-semibold text-[#55574f] transition-colors hover:text-[#9f5528] ${FOCO}`}
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Volver al inicio
            </Link>
            <p className={`mt-8 ${ETIQUETA}`}>Declaración pública · Centro de Reflexiones Críticas</p>
            <h1 className="crc-serif mt-4 text-balance text-[clamp(2rem,3.2vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
              Los derechos de la niñez no son negociables.
            </h1>
            <p className="mt-6 max-w-[60ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">
              Juan Carlos Rauld, director del Centro de Reflexiones Críticas, se pronuncia ante la vulneración de
              derechos que afecta a niños, niñas y adolescentes en Chile, con especial preocupación por la situación
              de la niñez migrante haitiana.
            </p>
          </div>

          <figure className="mx-auto w-full max-w-[340px]">
            <div className="overflow-hidden rounded-[6px] border border-[#d8cfc0] bg-[#15120e]">
              <video
                controls
                preload="metadata"
                playsInline
                className="aspect-[9/16] w-full bg-[#15120e] object-cover"
                src="/videos/declaraciones/declaracion-ninez-migrante-haitiana.mp4"
              />
            </div>
            <figcaption className="mt-3 text-[0.8125rem] text-[#6f675d]">
              Declaración en video de Juan Carlos Rauld.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-[#fffdf8]">
        <div className={`${CONTENEDOR} grid gap-10 py-14 sm:py-20 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16`}>
          <aside>
            <div className="border-t border-[#d8cfc0] pt-5 lg:sticky lg:top-28">
              <h2 className="text-[1rem] font-semibold">Ejes de la declaración</h2>
              <ol className="mt-4">
                {axes.map((axis, index) => (
                  <li
                    key={axis}
                    className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 border-b border-[#eee8dc] py-3.5"
                  >
                    <span className="text-[0.9375rem] font-semibold tabular-nums text-[#9f5528]">{index + 1}.</span>
                    <p className="text-[0.9375rem] leading-[1.6] text-[#55574f]">{axis}</p>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <article className="max-w-[65ch]">
            <p className={`border-b border-[#d8cfc0] pb-4 ${ETIQUETA}`}>Texto institucional</p>

            <div className="mt-8 space-y-6 text-[1.0625rem] leading-[1.7] text-[#171713]">
              <p className="crc-serif text-[1.35rem] font-medium leading-[1.4] sm:text-[1.5rem]">
                La defensa de los derechos de la niñez no puede depender de coyunturas políticas, intereses electorales
                ni cálculos presupuestarios.
              </p>
              <p>
                Desde el Centro de Reflexiones Críticas emitimos esta declaración pública para denunciar la vulneración
                de derechos que afecta a niños, niñas y adolescentes en Chile, con especial preocupación por la
                situación que enfrenta la niñez migrante haitiana.
              </p>
              <p>
                Sin embargo, este pronunciamiento trasciende un caso particular: interpela a un modelo institucional
                que continúa reproduciendo exclusiones, omisiones y prácticas que contradicen el marco de derechos
                vigente.
              </p>
              <p>
                A cuatro años de la promulgación de la Ley 21.430, resulta indispensable preguntarnos cuánto hemos
                avanzado realmente en garantizar el derecho a la protección, la vivienda, la salud mental, la
                participación y el acceso efectivo a la justicia para todas las infancias.
              </p>
              <p>
                Ningún niño, niña o adolescente debe ser invisibilizado por su origen, condición social, nacionalidad o
                situación administrativa.
              </p>
              <p className="crc-serif border-l-2 border-[#bd6f3c] pl-5 text-[1.35rem] font-medium leading-[1.4] sm:text-[1.5rem]">
                Los derechos de la niñez no son negociables. Son una obligación ética, jurídica y política para toda la
                sociedad.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-[#15120e]">
        <div className={`${CONTENEDOR} flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between lg:py-16`}>
          <div>
            <p className="text-[0.8125rem] font-semibold text-[#e4935d]">Posición CRC</p>
            <h2 className="crc-serif mt-2 text-balance text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-[#fbf7ee]">
              Infancia, derechos y responsabilidad institucional.
            </h2>
          </div>
          <Link
            href="/conocenos#equipo"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[6px] bg-[#bd6f3c] px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e4935d]"
          >
            Conocer al equipo
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
