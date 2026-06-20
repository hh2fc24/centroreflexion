import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText, Scale, ShieldAlert } from "lucide-react";
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

export default function DeclaracionNinezMigranteHaitianaPage() {
  return (
    <main className="bg-[#fffdf8] text-[#171713]">
      <section className="relative overflow-hidden border-b border-[#2a2c27] bg-[#171713]">
        <div className="absolute inset-0 opacity-15">
          <img src="/images/infancia_olvidada_adopcion.png" alt="" className="h-full w-full object-cover mix-blend-luminosity" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#171713] via-[#171713]/94 to-[#171713]/65" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#b0a898] transition hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver al inicio
            </Link>
            <div className="mt-10">
              <span className="inline-flex items-center gap-2 rounded-[5px] border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d3976d]">
                <ShieldAlert className="h-3.5 w-3.5" />
                Declaración pública
              </span>
              <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl font-serif">
                Los derechos de la niñez no son negociables.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#d8d0c4]">
                Juan Carlos Rauld, director del Centro de Reflexiones Críticas, se pronuncia ante la vulneración de derechos que afecta a niños, niñas y adolescentes en Chile, con especial preocupación por la situación de la niñez migrante haitiana.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="mx-auto max-w-[360px] overflow-hidden rounded-[8px] border border-white/15 bg-[#0f100d] shadow-2xl">
              <video
                controls
                preload="metadata"
                playsInline
                className="aspect-[9/16] w-full bg-black object-cover"
                src="/videos/declaraciones/declaracion-ninez-migrante-haitiana.mp4"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#eee8dc] bg-[#fffdf8] py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <aside className="lg:col-span-4">
            <div className="sticky top-28 border-y border-[#ded5c7] py-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Ejes de la declaración</p>
              <div className="mt-6 space-y-5">
                {axes.map((axis, index) => (
                  <div key={axis} className="grid grid-cols-[36px_1fr] gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[5px] border border-[#dec0a8] bg-[#f8f5ee] text-sm font-bold text-[#9f5528]">
                      0{index + 1}
                    </span>
                    <p className="text-sm leading-6 text-[#55574f]">{axis}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <article className="lg:col-span-8">
            <div className="mb-8 flex items-center gap-3 border-b border-[#ded5c7] pb-5">
              <FileText className="h-5 w-5 text-[#bd6f3c]" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#70695f]">Texto institucional</p>
            </div>

            <div className="max-w-3xl space-y-7 text-lg leading-9 text-[#3f423a]">
              <p className="text-2xl font-bold leading-9 text-[#171713] font-serif">
                La defensa de los derechos de la niñez no puede depender de coyunturas políticas, intereses electorales ni cálculos presupuestarios.
              </p>
              <p>
                Desde el Centro de Reflexiones Críticas emitimos esta declaración pública para denunciar la vulneración de derechos que afecta a niños, niñas y adolescentes en Chile, con especial preocupación por la situación que enfrenta la niñez migrante haitiana.
              </p>
              <p>
                Sin embargo, este pronunciamiento trasciende un caso particular: interpela a un modelo institucional que continúa reproduciendo exclusiones, omisiones y prácticas que contradicen el marco de derechos vigente.
              </p>
              <p>
                A cuatro años de la promulgación de la Ley 21.430, resulta indispensable preguntarnos cuánto hemos avanzado realmente en garantizar el derecho a la protección, la vivienda, la salud mental, la participación y el acceso efectivo a la justicia para todas las infancias.
              </p>
              <p>
                Ningún niño, niña o adolescente debe ser invisibilizado por su origen, condición social, nacionalidad o situación administrativa.
              </p>
              <p className="border-l-2 border-[#bd6f3c] pl-6 text-2xl font-bold leading-9 text-[#171713] font-serif">
                Los derechos de la niñez no son negociables. Son una obligación ética, jurídica y política para toda la sociedad.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-[#171713] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d3976d]">
              <Scale className="h-4 w-4" />
              Posición CRC
            </span>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-white font-serif sm:text-3xl">
              Infancia, derechos y responsabilidad institucional.
            </h2>
          </div>
          <Link
            href="/conocenos#equipo"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[5px] bg-[#fffdf8] px-5 py-3 text-sm font-bold text-[#171713] transition hover:bg-[#eee8dc]"
          >
            Conocer al equipo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
