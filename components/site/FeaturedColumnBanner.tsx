"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function FeaturedColumnBanner() {
  return (
    <section className="border-b border-[#34362f] bg-[#171713] px-5 py-12 sm:px-8 sm:py-16 lg:px-14 overflow-hidden">
      <div className="mx-auto max-w-[1640px]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid gap-10 lg:grid-cols-2 lg:items-center xl:gap-20"
        >
          {/* Text Content */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#d3976d]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d3976d]">
                Columna Destacada
              </span>
            </div>
            
            <h2 className="mb-6 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:leading-[1.1]">
              Foucault y la infancia que la filosofía olvidó
            </h2>
            
            <p className="mb-8 max-w-xl text-base leading-relaxed text-[#a8a8a1] sm:text-lg">
              A 42 años de la muerte de Michel Foucault, su obra sigue siendo uno de los arsenales intelectuales más poderosos para comprender cómo opera el poder. Sin embargo, dejó inconcluso un aspecto decisivo de la biopolítica: nunca teorizó la infancia como población específica.
            </p>
            
            <div className="flex items-center justify-between border-t border-[#34362f] pt-6 sm:justify-start sm:gap-12">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d3976d]">Autor</p>
                <p className="mt-1 font-serif text-lg font-medium text-[#f1ede4]">Juan Carlos Rauld Farias</p>
              </div>
              
              <Link
                href="/pensamiento-critico/foucault-infancia-filosofia-olvido"
                className="group inline-flex items-center justify-center gap-3 rounded-[5px] bg-[#d3976d] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-[#171713] transition-all hover:bg-[#c48961]"
              >
                Leer columna
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <Link 
              href="/pensamiento-critico/foucault-infancia-filosofia-olvido"
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[8px] border border-[#34362f] bg-[#22221e]"
            >
              <div className="absolute inset-0 z-10 bg-black/10 transition-colors group-hover:bg-transparent" />
              <Image
                src="/images/foucault_infancia_biopolitica.jpg"
                alt="Foucault, infancia y biopolítica"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 saturate-[0.85]"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
