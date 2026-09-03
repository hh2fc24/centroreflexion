"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Play, Scale, ShieldAlert } from "lucide-react";
import { useEditor, usePages } from "@/lib/editor/hooks";
import { BlockCanvas } from "@/components/site/blocks/BlockCanvas";
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
      <BlockCanvas page={home} editable={adminEnabled} />
      <HomeSeminarioBanner />
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
    <section className="relative overflow-hidden border-b border-[#34362f] bg-[#15120e]">
      <div className="absolute inset-0">
        <Image
          src="/images/desproteccion-institucionalizacion-editorial.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-70 saturate-[0.78]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,14,10,0.96)_0%,rgba(17,14,10,0.9)_38%,rgba(17,14,10,0.55)_70%,rgba(17,14,10,0.3)_100%)]" />
        <div className="absolute inset-0 bg-[#7c4a26]/20 mix-blend-multiply" />
      </div>

      <div className="relative mx-auto max-w-[1640px] px-5 py-14 sm:px-8 sm:py-16 lg:px-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-[640px]">
            <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.22em] text-[#f1ede4]">
              Seminario en vivo
              <span className="mx-2 text-[#bd6f3c]">·</span>
              Cohorte 1
              <span className="mx-2 text-[#bd6f3c]">·</span>
              Octubre 2026
            </p>

            <h2 className="crc-serif mt-4 text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[1.02] text-[#fbf7ee]">
              Desprotección de la <span className="italic text-[#bd6f3c]">infancia</span>
            </h2>

            <div className="my-5 h-px w-14 bg-[#bd6f3c]" />

            <p className="max-w-[520px] text-[0.9rem] font-semibold leading-[1.65] text-[#ede7dc]/85">
              Ocho sesiones con Juan Carlos Rauld, autor del libro y Director del CRC. Jueves de 19:00 a 21:00, del 15
              de octubre al 3 de diciembre. Cohorte cerrada de quince personas, con certificación CRC y Editorial
              Hammurabi.
            </p>

            <p className="mt-4 text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-[#bd6f3c]">
              La matrícula cierra el martes 13 de octubre
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/seminarios/desproteccion-infancia"
              className="inline-flex h-11 items-center gap-3 rounded-[5px] bg-[#bd6f3c] px-6 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-white shadow-[0_18px_40px_rgba(90,45,18,0.32)] transition duration-200 hover:bg-[#a85f31]"
            >
              Ver el seminario
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/seminarios/desproteccion-infancia#postular"
              className="inline-flex h-11 items-center rounded-[5px] border border-[#f1ede4]/42 px-6 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-white transition duration-200 hover:border-[#f1ede4]/72 hover:bg-white/10"
            >
              Postular
            </Link>
          </div>
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
