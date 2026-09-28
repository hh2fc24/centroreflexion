"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Play } from "lucide-react";
import {
  HomeAudienceDoors,
  HomeBooksBand,
  HomeManifesto,
  HomeTeamClose,
} from "@/components/site/home/HomeSections";
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
            <HomeAudienceDoors />
            <HomeManifesto />
            <FeaturedColumnBanner />
          </>
        }
      />
      <HomeBooksBand />
      <HomePublicDeclaration />
      <HomeTeamClose />
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
      className="border-b border-[#d8cfc0] bg-[#fffdf8] text-[#171713]"
    >
      <div className="mx-auto max-w-[1640px] px-5 py-14 sm:px-8 sm:py-20 lg:px-14 xl:px-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-6">
            <p className="text-[0.8125rem] font-semibold text-[#9f5528]">
              Matrícula abierta · Cohorte 1 · 15 de octubre al 3 de diciembre de 2026
            </p>

            <h2
              id="home-seminario-title"
              className="crc-serif mt-3 max-w-[28ch] text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-balance"
            >
              Seminario Desprotección de la infancia
            </h2>

            <p className="crc-serif mt-3 max-w-[40ch] text-[1.25rem] leading-[1.4] text-[#55574f]">
              Dominación, biopolítica y gobierno de la infancia en Chile.
            </p>

            <p className="mt-5 max-w-[60ch] text-[1rem] leading-[1.7] text-[#55574f]">
              Ocho sesiones en vivo con Juan Carlos Rauld para recorrer a Foucault, el poder disciplinario y el Chile del
              SENAME. Una cohorte en vivo, con ensayo final y certificación CRC y Editorial Hammurabi.
            </p>

            <dl className="mt-7 grid max-w-[560px] grid-cols-3 border-y border-[#d8cfc0]">
              {[
                ["8", "sesiones en vivo"],
                ["60", "días de grabaciones"],
                ["16", "horas de seminario"],
              ].map(([value, label], index) => (
                <div key={label} className={index === 0 ? "py-4 pr-4" : "border-l border-[#d8cfc0] px-4 py-4 sm:px-5"}>
                  <dt className="crc-serif text-[1.6rem] font-medium leading-none tabular-nums">{value}</dt>
                  <dd className="mt-1.5 text-[0.8125rem] leading-snug text-[#6f675d]">{label}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 text-[0.875rem] leading-[1.6] text-[#6f675d]">
              Jueves de 19:00 a 21:00 · Cierre de matrícula: martes 13 de octubre, 23:59
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href="/seminarios/desproteccion-infancia#inversion"
                className="group inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-[#bd6f3c] px-5 py-2.5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf8]"
              >
                Matricularme
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link
                href="/seminarios/desproteccion-infancia#programa"
                className="inline-flex min-h-11 items-center text-[0.9375rem] font-semibold text-[#171713] underline decoration-[#bd6f3c] underline-offset-[6px] transition-colors hover:text-[#9f5528] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713]"
              >
                Conocer el programa
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Link
              href="/seminarios/desproteccion-infancia"
              aria-label="Ver el seminario Desprotección de la infancia"
              className="relative block aspect-[4/3] overflow-hidden rounded-[6px] bg-[#eee8dc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf8] sm:aspect-[16/10]"
            >
              <Image
                src="/images/desproteccion-institucionalizacion-editorial.png"
                alt="Pasillo institucional con una silla y un libro, imagen del seminario Desprotección de la infancia"
                fill
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover object-center"
              />
            </Link>

            <figure className="mt-4 flex items-center gap-4 border-t border-[#d8cfc0] pt-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[6px] bg-[#eee8dc] sm:h-[72px] sm:w-[72px]">
                <Image
                  src="/images/juan-carlos-rauld-furia-del-libro.jpg"
                  alt="Juan Carlos Rauld exponiendo en La Furia del Libro"
                  fill
                  sizes="72px"
                  className="object-cover object-[60%_25%]"
                />
              </div>
              <figcaption className="text-[0.875rem] leading-[1.5] text-[#6f675d]">
                <span className="font-semibold text-[#171713]">Juan Carlos Rauld</span>, a cargo del seminario, en La
                Furia del Libro.
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePublicDeclaration() {
  return (
    <section className="border-b border-[#ded5c7] bg-[#f8f5ee] px-5 py-14 sm:px-8 sm:py-20 lg:px-14 xl:px-20">
      <div className="mx-auto grid max-w-[1640px] gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7 xl:col-span-8">
          <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Declaración pública</p>
          <h2 className="crc-serif mt-3 max-w-[26ch] text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-[#171713] text-balance">
            Los derechos de la niñez no son negociables.
          </h2>
          <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">
            Juan Carlos Rauld, director del CRC, se pronuncia ante la vulneración de derechos que afecta a niños, niñas y adolescentes en Chile, con especial preocupación por la niñez migrante haitiana.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/declaracion-publica/ninez-migrante-haitiana"
              className="group inline-flex min-h-11 items-center gap-2 rounded-[6px] border border-[#171713] px-5 py-2.5 text-[0.9375rem] font-semibold text-[#171713] transition-colors hover:bg-[#171713] hover:text-[#fffdf8]"
            >
              Ver declaración completa
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/conocenos#equipo"
              className="inline-flex min-h-11 items-center text-[0.9375rem] font-semibold text-[#171713] underline decoration-[#bd6f3c] underline-offset-[6px] transition-colors hover:text-[#9f5528]"
            >
              Conocer al director
            </Link>
          </div>
        </div>

        <figure className="lg:col-span-5 xl:col-span-4">
          <Link
            href="/declaracion-publica/ninez-migrante-haitiana"
            aria-label="Ver el video de la declaración pública"
            className="group relative mx-auto block max-w-[280px] overflow-hidden rounded-[6px] border border-[#ded5c7] bg-[#171713] lg:mx-0"
          >
            <video
              muted
              loop
              playsInline
              preload="metadata"
              className="aspect-[9/16] w-full object-cover"
              src="/videos/declaraciones/declaracion-ninez-migrante-haitiana.mp4"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#15120e]/80 text-white transition-colors group-hover:bg-[#bd6f3c]">
                <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
              </span>
            </span>
          </Link>
          <figcaption className="mx-auto mt-3 max-w-[280px] text-[0.875rem] leading-[1.5] text-[#6f675d] lg:mx-0">
            Video de la declaración · Juan Carlos Rauld
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
