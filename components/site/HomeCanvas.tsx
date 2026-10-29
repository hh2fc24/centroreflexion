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
import { HomePautaInterview } from "@/components/site/HomePautaInterview";
import type { SitePage } from "@/lib/editor/types";
import { SEMINAR_PATH } from "@/components/ColumnCta";

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
            <HomeAudienceDoors />
            <HomeManifesto />
            <FeaturedColumnBanner />
            <HomePautaInterview />
          </>
        }
      />
      <HomeBooksBand />
      <HomeSeminarioCierre />
      <HomePublicDeclaration />
      <HomeTeamClose />
    </>
  );
}

/**
 * Seminario en portada, ya cerrado: la primera versión completó sus cupos y la
 * próxima está por confirmar. Deja de ser la banda principal y baja a una
 * franja breve después de los libros (el seminario se basa en uno de ellos),
 * con un solo paso: dejar los datos para la próxima versión.
 */
function HomeSeminarioCierre() {
  return (
    <section aria-labelledby="home-seminario-title" className="border-y border-[#d8cfc0] bg-[#f8f5ee] text-[#171713]">
      <div className="mx-auto grid max-w-[1640px] gap-6 px-5 py-10 sm:px-8 lg:grid-cols-[72px_minmax(0,1fr)_auto] lg:items-center lg:gap-10 lg:px-14 xl:px-20">
        <div className="relative hidden h-24 w-[72px] overflow-hidden rounded-[6px] bg-[#eee8dc] lg:block">
          <Image
            src="/images/book_desproteccion.png"
            alt="Portada del libro Desprotección de la infancia"
            fill
            sizes="72px"
            className="object-cover"
          />
        </div>
        <div className="max-w-[68ch]">
          <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Seminario finalizado con éxito</p>
          <h2
            id="home-seminario-title"
            className="crc-serif mt-2 text-balance text-[clamp(1.3rem,1.8vw,1.75rem)] font-medium leading-[1.2]"
          >
            Desprotección de la infancia completó sus cupos en tiempo récord
          </h2>
          <p className="mt-2 text-[0.9375rem] leading-[1.6] text-[#55574f]">
            Gracias a cada profesional que se sumó a la primera versión con Juan Carlos Rauld. Se viene una nueva, con
            fecha por confirmar.
          </p>
        </div>
        <Link
          href={`${SEMINAR_PATH}#postular`}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 text-[0.9375rem] font-semibold text-[#171713] underline decoration-[#bd6f3c] underline-offset-[6px] transition-colors hover:text-[#9f5528] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713]"
        >
          Avísame de la próxima versión
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
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
            <Image
              src="/images/declaracion-ninez-migrante-haitiana-poster.jpg"
              alt="Juan Carlos Rauld leyendo la declaración pública"
              width={576}
              height={1024}
              sizes="280px"
              className="aspect-[9/16] w-full object-cover"
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
