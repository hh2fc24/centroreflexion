"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { TypographicCover } from "@/components/TypographicCover";
import { useArticles } from "@/lib/editor/hooks";

const COLUMN_ID = "foucault-infancia-filosofia-olvido";
const COLUMN_HREF = `/pensamiento-critico/${COLUMN_ID}`;
/** Imagen editorial de la columna, por si el store aún no cargó. */
const COLUMN_IMAGE = "/images/foucault_infancia_biopolitica.jpg";

export function FeaturedColumnBanner() {
  const { columns, reviews } = useArticles();
  const article = columns.find((a) => a.id === COLUMN_ID) ?? reviews.find((a) => a.id === COLUMN_ID);
  // La imagen del artículo es la línea editorial (guía §4); la portada
  // tipográfica solo entra si la columna quedó sin imagen.
  const image = article ? article.image : COLUMN_IMAGE;

  return (
    <section className="border-b border-[#d8cfc0] bg-[#f8f5ee] px-5 py-14 sm:px-8 sm:py-20 lg:px-14 xl:px-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mx-auto grid max-w-[1640px] gap-10 lg:grid-cols-12 lg:items-center lg:gap-14"
      >
        <div className="lg:col-span-6">
          <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Columna destacada</p>

          <h2 className="crc-serif mt-3 max-w-[24ch] text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-[#171713] text-balance">
            Foucault y la infancia que la filosofía olvidó
          </h2>

          <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">
            A 42 años de la muerte de Michel Foucault, su obra sigue siendo uno de los arsenales intelectuales más poderosos
            para comprender cómo opera el poder. Sin embargo, dejó inconcluso un aspecto decisivo de la biopolítica: nunca
            teorizó la infancia como población específica.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[#d8cfc0] pt-6">
            <div>
              <p className="text-[0.8125rem] font-semibold text-[#6f675d]">Autor</p>
              <p className="crc-serif mt-0.5 text-[1.125rem] font-medium text-[#171713]">Juan Carlos Rauld Farias</p>
            </div>

            <Link
              href={COLUMN_HREF}
              className="group inline-flex min-h-11 items-center gap-2 rounded-[6px] border border-[#171713] px-5 py-2.5 text-[0.9375rem] font-semibold text-[#171713] transition-colors hover:bg-[#171713] hover:text-[#fffdf8]"
            >
              Leer columna
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <Link
          href={COLUMN_HREF}
          aria-label="Leer la columna Foucault y la infancia que la filosofía olvidó"
          className="block rounded-[6px] transition-transform duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] focus-visible:ring-offset-4 lg:col-span-6"
        >
          {image ? (
            <span className="relative block aspect-[4/3] overflow-hidden rounded-[6px] bg-[#eee8dc] sm:aspect-[16/10]">
              <Image
                src={image}
                alt="Foucault, infancia y biopolítica"
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover object-center"
              />
            </span>
          ) : (
            <TypographicCover
              category="Filosofía"
              title="«Nunca teorizó la infancia como población específica.»"
              date="23 Jul 2026"
              tone="ink"
              className="sm:aspect-[16/10] sm:p-10"
            />
          )}
        </Link>
      </motion.div>
    </section>
  );
}
