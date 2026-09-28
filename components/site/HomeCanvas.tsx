"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, CalendarDays, Play, Scale, ShieldAlert } from "lucide-react";
import { useEditor, usePages } from "@/lib/editor/hooks";
import { BlockCanvas } from "@/components/site/blocks/BlockCanvas";
import { FeaturedColumnBanner } from "@/components/site/FeaturedColumnBanner";
import type { SitePage } from "@/lib/editor/types";

export function HomeCanvas({ initialPage }: { initialPage?: SitePage | null }) {
  const { adminEnabled } = useEditor();
  const { pages } = usePages();

  // Prefer the live store (keeps admin edits reactive), but fall back to the
  // server-provided snapshot so the page renders on first paint without waiting
  // for the async /api/public-site fetch to complete.
  const home = useMemo(
    () => pages.find((p) => p.id === "home" || p.slug === "") ?? initialPage ?? null,
    [pages, initialPage]
  );
  if (!home) return null;

  return (
    <>
      <BlockCanvas
        page={home}
        editable={adminEnabled}
        afterFirstBlock={
          <>
            <HomeSeminarioBanner />
            <FeaturedColumnBanner />
          </>
        }
      />
      <HomePublicDeclaration />
      <HomeComplianceBanner />
    </>
  );
}

/**
 * Banda del seminario en portada. Va sobre la declaración pública porque
 * mientras dure la campaña es la única página del sitio con fecha de cierre:
 * si no está a la vista en el home, el tráfico de Instagram y LinkedIn llega
 * a la portada y no encuentra por dónde entrar.
 */
function HomeSeminarioBanner() {
  return (
    <section
      aria-labelledby="home-seminario-title"
      className="relative isolate overflow-hidden border-b border-[#342b22] bg-[#15120e] text-[#f8f3e9]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(255,255,255,0.9)_0.45px,transparent_0.45px)] [background-size:5px_5px]" />

      <div className="relative mx-auto max-w-[1640px] px-5 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-14 xl:px-20">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5 sm:mb-10">
          <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.22em] text-[#d98a55]">
            Matrícula abierta · Cohorte 1
          </p>
          <p className="flex items-center gap-2 text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#eee6d9]/70">
            <CalendarDays className="h-3.5 w-3.5 text-[#d98a55]" aria-hidden="true" />
            15 de octubre — 3 de diciembre de 2026
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(420px,0.96fr)] lg:items-stretch lg:gap-14 xl:gap-20">
          <div className="flex flex-col justify-center py-2 lg:py-7">
            <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-[#eee6d9]/68">
              Seminario en vivo · Michel Foucault y biopolítica
            </p>

            <h2
              id="home-seminario-title"
              className="crc-serif mt-5 max-w-[11ch] text-[clamp(3rem,6.2vw,6.7rem)] font-medium leading-[0.84] tracking-[-0.035em] text-[#fffaf0] text-balance"
            >
              Desprotección de la <span className="italic text-[#d98a55]">infancia</span>
            </h2>

            <p className="crc-serif mt-7 max-w-[34ch] text-[clamp(1.15rem,1.7vw,1.55rem)] font-light italic leading-[1.35] text-[#eee6d9]/88">
              Dominación, biopolítica y gobierno de la infancia en Chile.
            </p>

            <p className="mt-6 max-w-[60ch] text-[0.92rem] font-medium leading-[1.75] text-[#eee6d9]/72">
              Ocho sesiones con Juan Carlos Rauld para recorrer a Foucault, el poder disciplinario y el Chile del
              SENAME. Una cohorte cerrada de quince personas, con certificación CRC y Editorial Hammurabi.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/seminarios/desproteccion-infancia#inversion"
                className="group inline-flex min-h-12 items-center gap-3 rounded-[4px] bg-[#d07840] px-7 py-3 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_20px_46px_rgba(86,42,18,0.38)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#b86534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fffaf0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15120e] active:translate-y-0"
              >
                Matricularme
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/seminarios/desproteccion-infancia#programa"
                className="inline-flex min-h-12 items-center border-b border-[#d98a55] px-2 py-3 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-[#fffaf0] transition duration-200 hover:border-[#fffaf0] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fffaf0]"
              >
                Conocer el programa
              </Link>
            </div>

            <dl className="mt-10 grid max-w-[680px] grid-cols-3 border-y border-white/15 py-5">
              {[
                ["8", "sesiones en vivo"],
                ["15", "cupos totales"],
                ["16", "horas de seminario"],
              ].map(([value, label], index) => (
                <div key={label} className={index === 0 ? "pr-4" : "border-l border-white/15 px-4 sm:px-6"}>
                  <dt className="crc-serif text-[clamp(1.75rem,3vw,2.7rem)] font-medium leading-none text-[#fffaf0]">
                    {value}
                  </dt>
                  <dd className="mt-2 text-[0.58rem] font-bold uppercase leading-[1.45] tracking-[0.14em] text-[#eee6d9]/55">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <Link
            href="/seminarios/desproteccion-infancia"
            aria-label="Ver el seminario Desprotección de la infancia"
            className="group relative min-h-[430px] overflow-hidden rounded-[7px] border border-white/15 bg-[#28251f] shadow-[0_36px_90px_rgba(0,0,0,0.38)] sm:min-h-[520px] lg:min-h-[640px]"
          >
            <Image
              src="/images/desproteccion-institucionalizacion-editorial.png"
              alt="Pasillo institucional con una silla y un libro, imagen del seminario Desprotección de la infancia"
              fill
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover object-center saturate-[0.72] transition duration-700 group-hover:scale-[1.025] group-hover:saturate-[0.86]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,12,10,0.08)_10%,rgba(13,12,10,0.02)_48%,rgba(13,12,10,0.8)_100%)]" />
            <div className="absolute right-5 top-5 border border-white/20 bg-[#15120e]/78 px-3 py-2 text-[0.58rem] font-extrabold uppercase tracking-[0.17em] text-[#fffaf0] backdrop-blur-md sm:right-7 sm:top-7">
              Jueves · 19:00 a 21:00
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-5 p-6 sm:p-8">
              <div>
                <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.19em] text-[#e4935d]">
                  Juan Carlos Rauld
                </p>
                <p className="crc-serif mt-2 max-w-[18ch] text-[1.55rem] font-medium leading-[1.02] text-[#fffaf0] sm:text-[2rem]">
                  Del pensamiento de Foucault a la institución chilena.
                </p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/35 bg-[#15120e]/65 text-white backdrop-blur transition duration-200 group-hover:border-[#e4935d] group-hover:bg-[#d07840]">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/15 pt-5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#eee6d9]/58 sm:flex-row sm:items-center sm:justify-between">
          <span>Cierre de matrícula: martes 13 de octubre, 23:59</span>
          <span>Certificación CRC + Editorial Hammurabi</span>
        </div>
      </div>
    </section>
  );
}

function HomePublicDeclaration() {
  return (
    <section className="border-b border-[#ded5c7] bg-[#fffdf8] px-5 py-12 sm:px-8 sm:py-16 lg:px-14">
      <div className="mx-auto grid max-w-[1640px] gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7 xl:col-span-8">
          <span className="inline-flex items-center gap-2 rounded-[5px] border border-[#ead8c7] bg-[#f8f5ee] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#9f5528]">
            <Scale className="h-3.5 w-3.5" />
            Declaración pública
          </span>
          <h2 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-[#171713] font-serif sm:text-5xl">
            Los derechos de la niñez no son negociables.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#55574f] sm:text-lg">
            Juan Carlos Rauld, director del CRC, se pronuncia ante la vulneración de derechos que afecta a niños, niñas y adolescentes en Chile, con especial preocupación por la niñez migrante haitiana.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/declaracion-publica/ninez-migrante-haitiana"
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#171713] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#34362f]"
            >
              Ver declaración completa
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/conocenos#equipo"
              className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-[#ded5c7] bg-[#fffdf8] px-5 py-3 text-sm font-bold text-[#171713] transition hover:border-[#bd6f3c]/50"
            >
              Director CRC
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <Link
            href="/declaracion-publica/ninez-migrante-haitiana"
            className="group mx-auto block max-w-[300px] overflow-hidden rounded-[8px] border border-[#ded5c7] bg-[#171713] shadow-[0_24px_55px_rgba(31,27,22,0.18)] transition hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(31,27,22,0.24)]"
          >
            <div className="relative">
              <video
                muted
                loop
                playsInline
                preload="metadata"
                className="aspect-[9/16] w-full object-cover opacity-90"
                src="/videos/declaraciones/declaracion-ninez-migrante-haitiana.mp4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171713]/75 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur transition group-hover:scale-105">
                  <Play className="ml-1 h-7 w-7 fill-current" />
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d3976d]">Video declaración</p>
                <p className="mt-1 text-sm font-bold leading-snug text-white">Juan Carlos Rauld</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function HomeComplianceBanner() {
  return (
    <section className="border-b border-[#34362f] bg-[#171713] px-5 py-8 sm:px-8 lg:px-14">
      <div className="mx-auto flex max-w-[1640px] flex-col gap-5 rounded-[8px] border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] bg-[#bd6f3c] text-white">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d3976d]">Compliance Escolar</p>
            <h2 className="mt-2 text-xl font-bold leading-snug text-white font-serif sm:text-2xl">
              Crisis de convivencia: ¿Está su colegio al día con la nueva normativa?
            </h2>
          </div>
        </div>
        <Link
          href="/servicios/compliance-escolar"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[5px] bg-[#fffdf8] px-5 py-3 text-sm font-bold text-[#171713] transition hover:bg-[#eee8dc]"
        >
          Conocer Servicio
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
