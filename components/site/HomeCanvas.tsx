"use client";

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
      <HomePublicDeclaration />
      <HomeComplianceBanner />
    </>
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
