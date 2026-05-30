"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const DISCIPLINES = [
  "Filosofía Crítica", "Ciencias Sociales", "Literatura", "Psicología",
  "Pensamiento Político", "Historia", "Ética", "Pedagogía Crítica",
  "Análisis Cultural", "Epistemología",
];

// Imágenes de dominio público vía Wikimedia Commons
const PHILOSOPHERS = [
  { name: "Karl Marx",           era: "Sociología clásica",    src: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Karl_Marx_001.jpg" },
  { name: "Max Weber",           era: "Sociología comprensiva", src: "https://upload.wikimedia.org/wikipedia/commons/1/16/Max_Weber_1917.jpg" },
  { name: "Friedrich Nietzsche", era: "Filosofía continental",  src: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Nietzsche187a.jpg" },
  { name: "Émile Durkheim",      era: "Sociología positiva",    src: "https://upload.wikimedia.org/wikipedia/commons/2/23/Emile_Durkheim.jpg" },
  { name: "Walter Benjamin",     era: "Escuela de Frankfurt",   src: "https://upload.wikimedia.org/wikipedia/commons/2/21/Walter_Benjamin_vers_1928.jpg" },
  { name: "Hannah Arendt",       era: "Filosofía política",     src: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Hannah_Arendt_1975_%28IV%29.jpg" },
  { name: "Theodor Adorno",      era: "Teoría crítica",         src: "https://upload.wikimedia.org/wikipedia/commons/1/10/Theodor_W._Adorno_1964.jpg" },
  { name: "Michel Foucault",     era: "Filosofía del poder",    src: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Michel_Foucault_1974_Brasil.jpg" },
  { name: "Rosa Luxemburg",      era: "Pensamiento crítico",    src: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Rosa_Luxemburg.jpg" },
  { name: "Georg Simmel",        era: "Sociología formal",      src: "https://upload.wikimedia.org/wikipedia/commons/5/58/GeorgSimmel.jpg" },
  { name: "Simone de Beauvoir",  era: "Existencialismo",        src: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Simone_de_Beauvoir2.png" },
  { name: "Herbert Marcuse",     era: "Teoría crítica",         src: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Herbert_Marcuse.png" },
];

const SLIDE_DURATION = 6000; // ms por filósofo

export function HeroAcademia() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opContent = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((i) => {
        setPrevIdx(i);
        return (i + 1) % PHILOSOPHERS.length;
      });
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const all = [...DISCIPLINES, ...DISCIPLINES];

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: "var(--ac-bg)" }}>

      {/* ── Carrusel de filósofos (fondo) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Imagen saliente */}
        <AnimatePresence>
          {prevIdx !== null && (
            <motion.div
              key={`prev-${prevIdx}`}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{}}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={PHILOSOPHERS[prevIdx].src}
                alt=""
                aria-hidden
                className="h-full w-full object-cover object-top"
                style={{ filter: "grayscale(100%) brightness(0.55) contrast(1.1)" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Imagen entrante con Ken Burns */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`curr-${currentIdx}`}
            initial={{ opacity: 0, scale: 1.0 }}
            animate={{ opacity: 1, scale: 1.06 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.8, ease: "easeInOut" },
              scale:   { duration: SLIDE_DURATION / 1000, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            <img
              src={PHILOSOPHERS[currentIdx].src}
              alt=""
              aria-hidden
              className="h-full w-full object-cover object-top"
              style={{ filter: "grayscale(100%) brightness(0.55) contrast(1.1)" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay oscuro principal — mantiene legibilidad del texto */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(8,8,12,0.82) 0%, rgba(8,8,12,0.70) 50%, rgba(8,8,12,0.78) 100%)" }}
        />

        {/* Degradado inferior para fundir con el marquee */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: "linear-gradient(to bottom, transparent, var(--ac-bg))" }}
        />

        {/* Atribución del pensador — esquina inferior derecha */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`name-${currentIdx}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            className="absolute bottom-20 right-6 text-right"
            style={{ zIndex: 5 }}
          >
            <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ac-gold)", opacity: 0.8 }}>
              {PHILOSOPHERS[currentIdx].era}
            </p>
            <p style={{ fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.06em", color: "rgba(240,236,228,0.5)", marginTop: "0.15rem" }}>
              {PHILOSOPHERS[currentIdx].name}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Fondo: grain + orb dorado sutil ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute inset-0 h-full w-full" style={{ opacity: 0.03 }} xmlns="http://www.w3.org/2000/svg">
          <filter id="hg"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#hg)" />
        </svg>
        <div className="ac-orb-1 absolute -left-64 bottom-0 h-[600px] w-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(212,168,67,0.09) 0%, transparent 68%)", filter: "blur(70px)" }} />
        <div className="ac-orb-2 absolute -right-48 top-0 h-[500px] w-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(80,55,180,0.07) 0%, transparent 68%)", filter: "blur(80px)" }} />
        {/* Regla vertical decorativa — solo desktop */}
        <div className="absolute right-[14%] top-0 hidden h-full w-px lg:block" style={{ background: "linear-gradient(to bottom, transparent, var(--ac-border) 25%, var(--ac-border) 75%, transparent)" }} />
      </div>

      {/* ── Contenido ── */}
      <motion.div
        style={{ y: yContent, opacity: opContent }}
        className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-14"
      >
        <div style={{
          paddingTop: "clamp(3.5rem, 10vh, 6rem)",
          paddingBottom: "clamp(3rem, 8vh, 5rem)",
          minHeight: "calc(100svh - 64px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="h-px w-10" style={{ background: "var(--ac-gold)" }} />
          <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--ac-gold)" }}>
            Academia CRC — 2025
          </span>
        </motion.div>

        {/* Headline — máximo como el h1 del hero existente del sitio */}
        <div className="max-w-4xl">
          {["La academia", "para mentes"].map((line, i) => (
            <motion.span
              key={line}
              className="block"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, ease, delay: i * 0.1 }}
              style={{
                fontFamily: "var(--font-cormorant, Georgia, serif)",
                fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: "-0.01em",
                color: "var(--ac-text)",
              }}
            >
              {line}
            </motion.span>
          ))}
          <motion.span
            className="block italic"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease, delay: 0.2 }}
            style={{
              fontFamily: "var(--font-cormorant, Georgia, serif)",
              fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: "-0.01em",
              color: "var(--ac-gold)",
            }}
          >
            críticas.
          </motion.span>
        </div>

        {/* Subtexto + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease, delay: 0.32 }}
          className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <p className="max-w-sm text-sm leading-relaxed" style={{ color: "var(--ac-text-2)" }}>
            Cursos y talleres del Centro de Reflexiones Críticas.{" "}
            <span style={{ color: "var(--ac-text-3)" }}>Profesores reales. Contenido en español. Aprende a tu ritmo.</span>
          </p>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* CTA primario — misma forma que el botón del hero principal del sitio */}
            <Link
              href="#catalogo"
              className="inline-flex h-10 items-center gap-2.5 px-5 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] transition-all duration-200"
              style={{
                background: "var(--ac-gold)",
                color: "#0a0a0f",
                borderRadius: "5px",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#b8912e"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--ac-gold)"; }}
            >
              Explorar cursos
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {/* CTA secundario — ghost, igual al secondary del hero */}
            <Link
              href="/academia/login"
              className="inline-flex h-10 items-center px-5 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] transition-all duration-200"
              style={{
                border: "1px solid rgba(240,236,228,0.25)",
                color: "rgba(240,236,228,0.75)",
                borderRadius: "5px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(240,236,228,0.55)";
                (e.currentTarget as HTMLElement).style.color = "var(--ac-text)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(240,236,228,0.25)";
                (e.currentTarget as HTMLElement).style.color = "rgba(240,236,228,0.75)";
              }}
            >
              Crear cuenta
            </Link>
          </div>
        </motion.div>

        {/* Respaldo editorial */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.55 }}
          className="mt-10 flex items-center gap-4"
        >
          <span style={{ fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ac-text-3)" }}>
            Respaldado por
          </span>
          <div className="h-px flex-1 max-w-[2rem]" style={{ background: "var(--ac-border)" }} />
          <Image
            src="/images/editorial-hammurabi-logo-transparent.png"
            alt="Editorial Hammurabi"
            width={96}
            height={32}
            style={{ opacity: 0.55, filter: "brightness(0) invert(1)", objectFit: "contain" }}
          />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="hidden lg:flex flex-col items-center gap-2 self-end mt-12"
        >
          <div className="ac-scroll-hint h-10 w-px" style={{ background: "linear-gradient(to bottom, var(--ac-gold), transparent)" }} />
          <span style={{ fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--ac-text-3)", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>Scroll</span>
        </motion.div>
        </div>
      </motion.div>

      {/* ── Marquee de disciplinas ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="relative z-10 overflow-hidden py-4"
        style={{ borderTop: "1px solid var(--ac-border)", borderBottom: "1px solid var(--ac-border)" }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20" style={{ background: "linear-gradient(to right, var(--ac-bg), transparent)" }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20" style={{ background: "linear-gradient(to left, var(--ac-bg), transparent)" }} />
        <div
          className="animate-marquee pause-on-hover"
          style={{ display: "flex", width: "max-content", flexWrap: "nowrap" }}
        >
          {all.map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "1.5rem", padding: "0 1.75rem", flexShrink: 0 }}>
              <span style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", color: "rgba(240,236,228,0.85)", whiteSpace: "nowrap" }}>
                {item}
              </span>
              <span style={{ display: "inline-block", height: "4px", width: "4px", borderRadius: "50%", flexShrink: 0, background: "var(--ac-gold)", opacity: 0.6 }} />
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
