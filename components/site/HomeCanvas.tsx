"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, ShieldAlert } from "lucide-react";
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
      <HomeComplianceBanner />
    </>
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
