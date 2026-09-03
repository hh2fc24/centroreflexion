import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SeminarioPostulacionForm } from "@/components/SeminarioPostulacionForm";
import { getSiteUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

const TITLE = "Seminario · Desprotección de la Infancia";
const DESCRIPTION =
  "Seminario en vivo de 8 sesiones con Juan Carlos Rauld, autor del libro y Director del CRC. Jueves 19:00, del 15 de octubre al 3 de diciembre de 2026. Cohorte cerrada de 15 personas. Certificación CRC + Editorial Hammurabi.";
const IMAGE_PATH = "/images/book_desproteccion.png";
// Corredor institucional vacío con una silla de escuela y un libro encima: es la
// única imagen del banco que dice "institución + infancia ausente" sin ilustrar
// a un niño, y su paleta cálida ya es la de la casa. Va de fondo del hero; la
// portada del libro queda como objeto aparte para que no se lea dos veces.
const HERO_IMAGE = "/images/desproteccion-institucionalizacion-editorial.png";

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${TITLE} | Centro de Reflexiones Críticas`,
    description: DESCRIPTION,
    path: "/seminarios/desproteccion-infancia",
    keywords: [
      "seminario infancia Chile",
      "biopolítica infancia",
      "Foucault infancia",
      "desprotección infantil",
      "formación protección infancia",
      "Juan Carlos Rauld",
      "SENAME Mejor Niñez formación",
    ],
  }),
  openGraph: {
    title: `${TITLE} | Centro de Reflexiones Críticas`,
    description: DESCRIPTION,
    type: "article",
    images: [{ url: `${getSiteUrl()}${IMAGE_PATH}`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${getSiteUrl()}${IMAGE_PATH}`],
  },
};

/* ────────────────────────────────────────────────────────────
   Parámetros del seminario.
   Todo lo que puede cambiar antes del lanzamiento vive acá arriba.
   ──────────────────────────────────────────────────────────── */

const DATOS = [
  { valor: "8", label: "sesiones en vivo" },
  { valor: "16", label: "horas de seminario" },
  { valor: "15", label: "cupos, cohorte cerrada" },
  { valor: "60", label: "días de grabaciones" },
  { valor: "2", label: "meses, un jueves por semana" },
];

const SESIONES = [
  {
    n: "01",
    fecha: "15 de octubre",
    titulo: "La infancia como problema filosófico",
    detalle: "Ariès y la invención histórica de la infancia. Por qué «niño» no es una categoría natural.",
  },
  {
    n: "02",
    fecha: "22 de octubre",
    titulo: "De la modernidad a la filosofía contemporánea",
    detalle: "Locke, Rousseau, Nietzsche y Benjamin: cuatro maneras incompatibles de mirar al niño.",
  },
  {
    n: "03",
    fecha: "29 de octubre",
    titulo: "Foucault: genealogía, disciplina y panoptismo",
    detalle: "Cómo leer una institución de infancia como dispositivo disciplinario.",
  },
  {
    n: "04",
    fecha: "5 de noviembre",
    titulo: "La biopolítica en Foucault",
    detalle: "Del poder que castiga al poder que administra la vida de las poblaciones.",
  },
  {
    n: "05",
    fecha: "12 de noviembre",
    titulo: "Hacia una biopolítica de la infancia",
    detalle: "La infancia pobre como población gobernada: riesgo, medición y gestión.",
  },
  {
    n: "06",
    fecha: "19 de noviembre",
    titulo: "Genealogía de la desprotección en Chile",
    detalle: "Del siglo XIX a 1973: casas de menores, patronato y la larga historia de la tutela.",
  },
  {
    n: "07",
    fecha: "26 de noviembre",
    titulo: "Del SENAME a la actualidad",
    detalle: "Qué cambió, qué no cambió y qué se reorganizó bajo un nombre nuevo.",
  },
  {
    n: "08",
    fecha: "3 de diciembre",
    titulo: "La desprotección frente al poder",
    detalle: "Cierre del argumento y presentación de los ensayos de la cohorte.",
  },
];

const TRAMOS = [
  {
    nombre: "Fundadores",
    cupos: "Cupos 1 a 5",
    precio: "225.000",
    ahorro: "Ahorras $75.000",
    nota: "Hasta el miércoles 1 de octubre, o hasta agotar los cinco cupos.",
    vigente: true,
  },
  {
    nombre: "Anticipada",
    cupos: "Cupos 6 a 10",
    precio: "265.000",
    ahorro: "Ahorras $35.000",
    nota: "Hasta el viernes 9 de octubre, o hasta agotar los cinco cupos.",
    vigente: false,
  },
  {
    nombre: "General",
    cupos: "Cupos 11 a 15",
    precio: "300.000",
    ahorro: "Valor de lista",
    nota: "Hasta el cierre de matrícula, martes 13 de octubre.",
    vigente: false,
  },
];

const PARA_QUIEN_SI = [
  "Duplas psicosociales de programas PIE, PRM, PPF, DAM y OPD.",
  "Equipos y direcciones de residencias y cuidado alternativo.",
  "Profesionales de educación y salud que trabajan con infancia vulnerada.",
  "Jefaturas y encargados municipales de niñez que deciden e implementan programas.",
  "Tesistas y docentes que investigan infancia, políticas sociales o biopolítica.",
];

const PARA_QUIEN_NO = [
  "Si buscas técnicas de intervención aplicables el lunes.",
  "Si necesitas un certificado rápido y no piensas leer entre sesiones.",
  "Si esperas un curso grabado para ver a tu ritmo: este es en vivo.",
];

const CREDENCIALES = [
  "Doctorando en Trabajo Social, Universidad Rovira i Virgili (España)",
  "Magíster en Filosofía Política Contemporánea, Universidad Diego Portales",
  "Trabajador Social, Universidad Tecnológica Metropolitana",
  "16 años dirigiendo programas de infancia y gestión pública en Chile",
];

const FAQ = [
  {
    q: "Son dos meses. ¿Y si falto a una sesión?",
    a: "Cada sesión queda grabada y disponible 60 días. La asistencia mínima para certificar es de 75%, o sea puedes faltar hasta a dos sesiones sin perder el certificado. Las sesiones parten y terminan a la hora: 19:00 a 21:00, sin excepción.",
  },
  {
    q: "¿Sirve si trabajo en terreno y no en clínica?",
    a: "Está pensado justamente para eso. El seminario no entrega técnicas clínicas: entrega herramientas para leer la institución en la que trabajas y entender por qué produce los resultados que produce. Quien trabaja en terreno es quien más rápido reconoce lo que se analiza en cada sesión.",
  },
  {
    q: "¿Por qué cuesta más que los cursos del catálogo?",
    a: "Los cursos de la Academia CRC son asincrónicos y de acceso abierto. Esto es distinto: 16 horas en vivo, cohorte cerrada de 15 personas, con el autor del libro en sala, discusión de casos reales y un ensayo final con retroalimentación individual. No es el mismo producto.",
  },
  {
    q: "¿Puedo pagar en cuotas?",
    a: "Sí. Tres transferencias sin interés: una antes de comenzar y dos durante el seminario. También aceptamos Webpay con las cuotas de tu emisor.",
  },
  {
    q: "Mi institución quiere inscribir a varias personas.",
    a: "Desde 3 personas de la misma institución, 15% de descuento para cada una. Emitimos factura. Reservamos un máximo de 5 cupos institucionales por cohorte para mantener la diversidad del grupo.",
  },
  {
    q: "¿Qué certificado recibo?",
    a: "Certificado de aprobación del Centro de Reflexiones Críticas con el respaldo de Editorial Hammurabi, casa editora del libro en el que se basa el seminario. Se emite al cumplir 75% de asistencia y entregar el ensayo final.",
  },
  {
    q: "¿Qué pasa si postulo y no quedo?",
    a: "Postular no compromete pago. Si la cohorte se completa, quedas primero en la lista para la cohorte 2 de marzo de 2027, con el precio de la cohorte 1 congelado.",
  },
];

/* ────────────────────────────────────────────────────────────
   Piezas tipográficas de la casa.
   El sitio no usa tarjetas redondeadas ni sombras: usa filetes,
   versalitas y Cormorant en itálica para el énfasis. Estas dos
   funciones evitan repetir esas clases en cada sección.
   ──────────────────────────────────────────────────────────── */

function Eyebrow({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "light" }) {
  return (
    <p
      className={`text-[0.66rem] font-extrabold uppercase tracking-[0.22em] ${
        tone === "gold" ? "text-[#bd6f3c]" : "text-[#f1ede4]"
      }`}
    >
      {children}
    </p>
  );
}

function Rule({ tone = "gold" }: { tone?: "gold" | "light" }) {
  return <div className={`my-5 h-px w-14 ${tone === "gold" ? "bg-[#bd6f3c]" : "bg-[#bd6f3c]"}`} />;
}

export default function SeminarioDesproteccionInfancia() {
  return (
    <div className="bg-[#f8f5ee] text-[#171713]">
      {/* ═══ HERO ═══════════════════════════════════════════ */}
      <section
        className="relative w-full overflow-hidden bg-[#15120e]"
        style={{ minHeight: "clamp(600px, calc(100svh - 110px), 780px)" }}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center saturate-[0.78] contrast-[1.04]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,14,10,0.96)_0%,rgba(17,14,10,0.9)_30%,rgba(17,14,10,0.58)_58%,rgba(17,14,10,0.22)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,247,242,0.02)_0%,rgba(21,18,14,0.12)_47%,rgba(21,18,14,0.6)_100%)]" />
          <div className="absolute inset-0 bg-[#7c4a26]/20 mix-blend-multiply" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-[1640px] items-center px-5 py-16 sm:px-8 sm:py-20 lg:px-14 xl:px-20">
          <div className="max-w-[680px]">
            <Eyebrow tone="light">
              Seminario en vivo
              <span className="mx-2 text-[#bd6f3c]">·</span>
              Cohorte 1
              <span className="mx-2 text-[#bd6f3c]">·</span>
              Octubre 2026
            </Eyebrow>

            <h1 className="crc-serif mt-5 text-[clamp(2.3rem,4vw,4.2rem)] font-medium leading-[0.98] text-[#fbf7ee]">
              Desprotección
              <br />
              de la <span className="italic text-[#bd6f3c]">infancia</span>
            </h1>

            <Rule />

            <p className="crc-serif max-w-[560px] text-[clamp(1.1rem,1.5vw,1.45rem)] font-light italic leading-[1.45] text-[#ede7dc]/90">
              Dominación, biopolítica y gobierno de la infancia en Chile.
            </p>

            <p className="mt-6 max-w-[540px] text-[0.9rem] font-semibold leading-[1.65] text-[#ede7dc]/85">
              Ocho sesiones en vivo con Juan Carlos Rauld, autor del libro y Director del CRC. Un recorrido desde
              Foucault hasta el Chile del SENAME para entender por qué la desprotección no es la ausencia del Estado,
              sino una forma específica de gobernar.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#postular"
                className="inline-flex h-11 items-center gap-3 rounded-[5px] bg-[#bd6f3c] px-6 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-white shadow-[0_18px_40px_rgba(90,45,18,0.32)] transition duration-200 hover:bg-[#a85f31]"
              >
                Postular al seminario <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#programa"
                className="inline-flex h-11 items-center rounded-[5px] border border-[#f1ede4]/42 bg-[#15120e]/18 px-6 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-white backdrop-blur-[2px] transition duration-200 hover:border-[#f1ede4]/72 hover:bg-white/10"
              >
                Ver el programa
              </Link>
            </div>

            {/* Meta + precio, en una sola franja de versalitas */}
            <dl className="mt-10 grid max-w-[560px] grid-cols-2 gap-x-8 gap-y-5 border-t border-[#f1ede4]/18 pt-6 sm:grid-cols-3">
              <div>
                <dt className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-[#bd6f3c]">Inicio</dt>
                <dd className="mt-1.5 text-[0.85rem] font-semibold text-[#f1ede4]">Jueves 15 de octubre</dd>
              </div>
              <div>
                <dt className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-[#bd6f3c]">Horario</dt>
                <dd className="mt-1.5 text-[0.85rem] font-semibold text-[#f1ede4]">Jueves, 19:00 a 21:00</dd>
              </div>
              <div>
                <dt className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-[#bd6f3c]">Valor</dt>
                <dd className="mt-1.5 text-[0.85rem] font-semibold text-[#f1ede4]">
                  $225.000{" "}
                  <span className="font-normal text-[#ede7dc]/50 line-through">$300.000</span>
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex items-center gap-4">
              <div className="relative h-10 w-10 shrink-0">
                <Image
                  src="/images/editorial-hammurabi-logo-transparent.png"
                  alt="Editorial Hammurabi"
                  fill
                  className="object-contain brightness-0 invert opacity-80"
                />
              </div>
              <p className="max-w-[420px] text-[0.78rem] leading-[1.6] text-[#ede7dc]/70">
                Certificación conjunta del Centro de Reflexiones Críticas y Editorial Hammurabi, casa editora del
                libro.
              </p>
            </div>
          </div>

          {/* La portada como objeto físico, no como fondo: se lee una sola vez
              y deja claro de qué libro sale el seminario. */}
          <div className="pointer-events-none absolute right-[6vw] top-1/2 hidden -translate-y-1/2 xl:block">
            <div className="relative h-[clamp(300px,32vw,440px)] w-[clamp(200px,21vw,292px)] rotate-[-2.5deg] shadow-[0_40px_90px_rgba(0,0,0,0.55)]">
              <Image
                src={IMAGE_PATH}
                alt="Portada del libro Desprotección de la infancia: Dominación, Biopolítica y Gobierno"
                fill
                priority
                sizes="292px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(255,255,255,0.14)_0%,transparent_38%)]" />
              <div className="absolute inset-y-0 left-0 w-[6px] bg-[linear-gradient(90deg,rgba(0,0,0,0.35),transparent)]" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FRANJA DE DATOS ════════════════════════════════ */}
      <section className="border-b border-[rgba(101,91,74,0.23)] bg-[#fffdf8]">
        <div className="mx-auto grid max-w-[1640px] grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {DATOS.map((d) => (
            <div
              key={d.label}
              className="border-b border-[rgba(101,91,74,0.16)] px-5 py-7 sm:px-7 lg:border-b-0 lg:border-r lg:border-[rgba(101,91,74,0.16)] lg:px-8 lg:py-9 lg:last:border-r-0"
            >
              <p className="crc-serif text-[2.4rem] font-medium leading-none text-[#171713]">{d.valor}</p>
              <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#55574f]">
                {d.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ QUÉ ES ═════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1640px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28 xl:px-20">
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)_320px] lg:gap-16">
          <div>
            <Eyebrow>El seminario</Eyebrow>
          </div>
          <div className="max-w-[62ch]">
            <h2 className="crc-serif text-[clamp(1.8rem,2.6vw,2.7rem)] font-medium leading-[1.08] text-[#171713]">
              No es un curso de técnicas. Es un seminario de{" "}
              <span className="italic text-[#bd6f3c]">lectura crítica</span>.
            </h2>
            <div className="my-6 h-px w-14 bg-[#bd6f3c]" />
            <p className="text-[0.97rem] leading-[1.85] text-[#3a3a33]">
              Ocho sesiones para construir, paso a paso, las herramientas conceptuales que permiten leer el sistema
              chileno de protección de la infancia por dentro. Empezamos preguntando qué es un niño para la filosofía
              occidental, pasamos por Foucault y la biopolítica, y terminamos en el Chile concreto de las residencias,
              los programas y los informes.
            </p>
            <p className="mt-5 text-[0.97rem] leading-[1.85] text-[#3a3a33]">
              Se basa en la investigación publicada en{" "}
              <Link
                href="/publicaciones"
                className="border-b border-[#bd6f3c] font-semibold text-[#171713] transition hover:text-[#9f5528]"
              >
                Desprotección de la infancia: Dominación, Biopolítica y Gobierno
              </Link>{" "}
              (Editorial Hammurabi). Es la primera vez que el autor lo dicta.
            </p>

          </div>

          <aside className="border-t border-[rgba(101,91,74,0.23)] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-[#bd6f3c]">
              En qué se diferencia del catálogo
            </p>
            <p className="mt-4 text-[0.88rem] leading-[1.8] text-[#55574f]">
              Los cursos de la Academia CRC son asincrónicos y de acceso abierto. Este seminario es en vivo, con una
              cohorte cerrada de quince personas, discusión de casos reales, ensayo final con retroalimentación
              individual y el autor del libro conduciendo cada sesión.
            </p>
            <p className="mt-4 text-[0.88rem] leading-[1.8] text-[#55574f]">
              Por eso tiene su propio valor y su propio cupo.
            </p>

            <dl className="mt-8 border-t border-[rgba(101,91,74,0.23)]">
              {[
                ["Formato", "En vivo, por Zoom"],
                ["Cohorte", "15 personas"],
                ["Evaluación", "Ensayo final con devolución"],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-[rgba(101,91,74,0.16)] py-3">
                  <dt className="text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-[#a9a294]">{k}</dt>
                  <dd className="mt-1 text-[0.85rem] font-semibold text-[#171713]">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* ═══ CITA ═══════════════════════════════════════════ */}
      <section className="bg-[#15120e]">
        <div className="mx-auto max-w-[1640px] px-5 py-20 sm:px-8 lg:px-14 lg:py-24 xl:px-20">
          <blockquote className="max-w-[62ch]">
            <p className="crc-serif text-[clamp(1.6rem,3vw,2.8rem)] font-light italic leading-[1.25] text-[#fbf7ee]">
              «Chile gobierna a su infancia pobre con tecnocracia, no con cuidado.»
            </p>
            <footer className="mt-7 flex items-center gap-4">
              <div className="h-px w-10 bg-[#bd6f3c]" />
              <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.2em] text-[#ede7dc]/70">
                Juan Carlos Rauld
              </span>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ═══ PARA QUIÉN ═════════════════════════════════════ */}
      <section className="mx-auto max-w-[1640px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28 xl:px-20">
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <div>
            <Eyebrow>Perfil</Eyebrow>
          </div>
          <div>
            <h2 className="crc-serif max-w-[20ch] text-[clamp(1.8rem,2.6vw,2.7rem)] font-medium leading-[1.08]">
              Para quién es —y <span className="italic text-[#bd6f3c]">para quién no</span>.
            </h2>

            <div className="mt-10 grid gap-10 border-t border-[rgba(101,91,74,0.23)] pt-9 md:grid-cols-2 md:gap-14">
              <div>
                <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-[#bd6f3c]">Es para ti si</p>
                <ul className="mt-5 space-y-4">
                  {PARA_QUIEN_SI.map((item) => (
                    <li
                      key={item}
                      className="border-b border-[rgba(101,91,74,0.16)] pb-4 text-[0.92rem] leading-[1.7] text-[#3a3a33]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-[#8a8276]">
                  No es para ti si
                </p>
                <ul className="mt-5 space-y-4">
                  {PARA_QUIEN_NO.map((item) => (
                    <li
                      key={item}
                      className="border-b border-[rgba(101,91,74,0.16)] pb-4 text-[0.92rem] leading-[1.7] text-[#8a8276]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROGRAMA ═══════════════════════════════════════ */}
      <section id="programa" className="scroll-mt-24 border-y border-[rgba(101,91,74,0.23)] bg-[#fffdf8]">
        <div className="mx-auto max-w-[1640px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28 xl:px-20">
          <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
            <div>
              <Eyebrow>Programa</Eyebrow>
              <p className="mt-5 max-w-[26ch] text-[0.82rem] leading-[1.7] text-[#55574f]">
                Todos los jueves de 19:00 a 21:00, del 15 de octubre al 3 de diciembre de 2026. Ninguna sesión cae en
                feriado.
              </p>
            </div>

            <div>
              <ol className="border-t border-[rgba(101,91,74,0.23)]">
                {SESIONES.map((s) => (
                  <li
                    key={s.n}
                    className="group grid gap-x-8 gap-y-2 border-b border-[rgba(101,91,74,0.16)] py-7 sm:grid-cols-[auto_120px_minmax(0,1fr)] sm:items-baseline"
                  >
                    <span className="crc-serif text-[1.6rem] font-medium leading-none text-[#bd6f3c]">{s.n}</span>
                    <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#8a8276]">
                      {s.fecha}
                    </span>
                    <div>
                      <h3 className="crc-serif text-[1.35rem] font-medium leading-[1.2] text-[#171713]">
                        {s.titulo}
                      </h3>
                      <p className="mt-2 max-w-[58ch] text-[0.88rem] leading-[1.75] text-[#55574f]">{s.detalle}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-9 border-l-2 border-[#bd6f3c] pl-6">
                <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-[#bd6f3c]">Ensayo final</p>
                <p className="mt-3 max-w-[62ch] text-[0.9rem] leading-[1.8] text-[#55574f]">
                  Cada participante escribe un ensayo breve aplicando el marco del seminario a su propio campo de
                  trabajo. Se entrega en la primera quincena de enero de 2027 y recibe retroalimentación individual del
                  autor. Es requisito para el certificado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ EL AUTOR ═══════════════════════════════════════ */}
      <section className="mx-auto max-w-[1640px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28 xl:px-20">
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <div>
            <Eyebrow>Quién lo dicta</Eyebrow>
          </div>

          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_300px] md:gap-14">
            <div>
              <h2 className="crc-serif text-[clamp(1.8rem,2.6vw,2.7rem)] font-medium leading-[1.08]">
                Juan Carlos <span className="italic text-[#bd6f3c]">Rauld</span>
              </h2>
              <p className="mt-3 text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#8a8276]">
                Director del CRC · Trabajador Social · Autor del libro
              </p>
              <div className="my-6 h-px w-14 bg-[#bd6f3c]" />

              <p className="max-w-[62ch] text-[0.95rem] leading-[1.85] text-[#3a3a33]">
                Investigador especializado en infancia, trauma psíquico y biopolítica. Magíster en Filosofía Política
                Contemporánea por la Universidad Diego Portales y Trabajador Social de la Universidad Tecnológica
                Metropolitana, con dieciséis años de experiencia en dirección de programas de infancia y gestión
                pública en Chile. Actualmente cursa un doctorado en Trabajo Social en la Universidad Rovira i Virgili,
                donde profundiza su investigación sobre cómo el Estado chileno gobierna —y desprotege— a la infancia
                pobre.
              </p>

              <ul className="mt-8 border-t border-[rgba(101,91,74,0.23)]">
                {CREDENCIALES.map((item) => (
                  <li
                    key={item}
                    className="border-b border-[rgba(101,91,74,0.16)] py-3.5 text-[0.86rem] leading-[1.7] text-[#55574f]"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
                <Link
                  href="/conocenos"
                  className="inline-flex items-center gap-2 border-b border-[#bd6f3c] pb-1 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-[#171713] transition hover:text-[#9f5528]"
                >
                  Perfil completo <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href="https://uc-cl.academia.edu/JUANCARLOSRAULDFAR%C3%8DAS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-[#8a8276] transition hover:text-[#bd6f3c]"
                >
                  Academia.edu
                </a>
                <a
                  href="https://www.linkedin.com/in/juan-carlos-rauld-farias-a64710a4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-[#8a8276] transition hover:text-[#bd6f3c]"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <div>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[5px] bg-[#eee8dc]">
                <Image src="/JC.jpeg" alt="Juan Carlos Rauld" fill className="object-cover" sizes="300px" />
              </div>

              <Link
                href="/publicaciones"
                className="mt-6 flex gap-4 border-t border-[rgba(101,91,74,0.23)] pt-6 transition"
              >
                <div className="relative h-24 w-[68px] shrink-0 overflow-hidden rounded-[3px] bg-[#eee8dc]">
                  <Image src={IMAGE_PATH} alt="Portada del libro" fill className="object-cover" sizes="68px" />
                </div>
                <div>
                  <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-[#bd6f3c]">
                    El libro del seminario
                  </p>
                  <p className="crc-serif mt-2 text-[1.05rem] font-medium leading-[1.25] text-[#171713]">
                    Desprotección de la infancia
                  </p>
                  <p className="mt-1.5 text-[0.75rem] text-[#8a8276]">Editorial Hammurabi</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ INVERSIÓN ══════════════════════════════════════ */}
      <section
        id="inversion"
        className="scroll-mt-24 border-y border-[rgba(101,91,74,0.23)] bg-[#fffdf8]"
      >
        <div className="mx-auto max-w-[1640px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28 xl:px-20">
          <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
            <div>
              <Eyebrow>Inversión</Eyebrow>
              <p className="mt-5 max-w-[26ch] text-[0.82rem] leading-[1.7] text-[#55574f]">
                El valor sube por tramos de cupo. Cuando se agotan los cinco cupos de un tramo, el tramo se cierra
                aunque la fecha todavía no haya llegado.
              </p>
            </div>

            <div>
              <div className="grid border-t border-[rgba(101,91,74,0.23)] sm:grid-cols-3">
                {TRAMOS.map((t, i) => (
                  <div
                    key={t.nombre}
                    className="border-b border-[rgba(101,91,74,0.16)] py-8 sm:border-b-0 sm:border-r sm:border-[rgba(101,91,74,0.16)] sm:py-0 sm:pb-2 sm:last:border-r-0"
                  >
                    <div className={`h-full sm:px-7 ${i === 0 ? "sm:pl-0" : ""}`}>
                      {t.vigente ? (
                        <span className="mb-4 inline-block bg-[#bd6f3c] px-2.5 py-1 text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-white">
                          Tramo vigente
                        </span>
                      ) : (
                        <span className="mb-4 inline-block px-0 py-1 text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-[#a9a294]">
                          Próximo tramo
                        </span>
                      )}
                      <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#171713]">
                        {t.nombre}
                      </p>
                      <p className="mt-1 text-[0.72rem] text-[#8a8276]">{t.cupos}</p>
                      <p className="crc-serif mt-5 text-[2.6rem] font-medium leading-none text-[#171713]">
                        ${t.precio}
                      </p>
                      <p className="mt-2 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#bd6f3c]">
                        {t.ahorro}
                      </p>
                      <p className="mt-4 max-w-[28ch] text-[0.8rem] leading-[1.65] text-[#55574f]">{t.nota}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-8 border-t border-[rgba(101,91,74,0.23)] pt-8 sm:grid-cols-2 sm:gap-14">
                <div>
                  <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-[#bd6f3c]">
                    Puedes pagar en tres cuotas
                  </p>
                  <p className="mt-3 text-[0.88rem] leading-[1.75] text-[#55574f]">
                    Tres transferencias sin interés: una antes de comenzar y dos durante el seminario. También Webpay
                    con las cuotas de tu emisor.
                  </p>
                </div>
                <div>
                  <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-[#bd6f3c]">
                    Convenio institucional
                  </p>
                  <p className="mt-3 text-[0.88rem] leading-[1.75] text-[#55574f]">
                    Desde tres personas de la misma institución, 15% de descuento para cada una y factura. Máximo cinco
                    cupos institucionales por cohorte.
                  </p>
                </div>
              </div>

              <p className="mt-10 border-l-2 border-[#bd6f3c] pl-6 text-[0.9rem] leading-[1.8] text-[#3a3a33]">
                <span className="font-bold text-[#171713]">
                  La matrícula cierra el martes 13 de octubre a las 23:59
                </span>
                , o antes si se completan los quince cupos. No reabrimos: la cohorte 2 se abre en marzo de 2027.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ POSTULACIÓN ════════════════════════════════════ */}
      <section id="postular" className="scroll-mt-24 bg-[#15120e]">
        <div className="mx-auto max-w-[1640px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28 xl:px-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-20">
            <div>
              <Eyebrow tone="light">Postulación</Eyebrow>
              <h2 className="crc-serif mt-5 max-w-[16ch] text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[1.05] text-[#fbf7ee]">
                Quince personas, <span className="italic text-[#bd6f3c]">una cohorte</span>.
              </h2>
              <Rule />
              <p className="max-w-[54ch] text-[0.95rem] leading-[1.8] text-[#ede7dc]/80">
                Revisamos cada postulación. Si tu perfil calza con la cohorte, te escribimos para una conversación
                breve de quince minutos y confirmamos tu cupo con el valor del tramo vigente. Postular no compromete
                pago.
              </p>

              <dl className="mt-12 border-t border-[#f1ede4]/18">
                {[
                  ["Inicio", "Jueves 15 de octubre, 19:00"],
                  ["Cierre de matrícula", "Martes 13 de octubre, 23:59"],
                  ["Grabaciones", "Disponibles 60 días"],
                  ["Certificación", "CRC + Editorial Hammurabi"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-6 border-b border-[#f1ede4]/12 py-4"
                  >
                    <dt className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#bd6f3c]">{k}</dt>
                    <dd className="crc-serif text-right text-[1.15rem] font-medium text-[#fbf7ee]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="border border-[#f1ede4]/14 bg-[#1c1710]/60 p-6 sm:p-8">
              <SeminarioPostulacionForm variant="dark" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ════════════════════════════════════════════ */}
      <section id="preguntas" className="scroll-mt-24">
        <div className="mx-auto max-w-[1640px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28 xl:px-20">
          <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
            <div>
              <Eyebrow>Preguntas</Eyebrow>
            </div>
            <div className="border-t border-[rgba(101,91,74,0.23)]">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group border-b border-[rgba(101,91,74,0.16)] py-5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-8">
                    <span className="crc-serif text-[1.25rem] font-medium leading-[1.35] text-[#171713] transition-colors group-open:text-[#9f5528]">
                      {item.q}
                    </span>
                    <span className="mt-1 shrink-0 text-[1.1rem] leading-none text-[#bd6f3c] transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-[62ch] text-[0.9rem] leading-[1.8] text-[#55574f]">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CIERRE ═════════════════════════════════════════ */}
      <section className="border-t border-[rgba(101,91,74,0.23)] bg-[#eee8dc]">
        <div className="mx-auto max-w-[1640px] px-5 py-20 sm:px-8 lg:px-14 lg:py-24 xl:px-20">
          <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)_auto] lg:items-end lg:gap-16">
            <div className="lg:self-start lg:pt-2">
              <Eyebrow>Cohorte 1</Eyebrow>
            </div>
            <div className="max-w-[46ch]">
              <h2 className="crc-serif text-[clamp(1.8rem,2.8vw,2.8rem)] font-medium leading-[1.08] text-[#171713]">
                Es la primera vez que el autor dicta este{" "}
                <span className="italic text-[#bd6f3c]">seminario</span>.
              </h2>
              <div className="my-6 h-px w-14 bg-[#bd6f3c]" />
              <p className="text-[0.95rem] leading-[1.8] text-[#55574f]">
                La cohorte 1 se cierra el martes 13 de octubre a las 23:59, o antes si se completan los quince cupos.
              </p>
            </div>
            <Link
              href="#postular"
              className="inline-flex h-11 shrink-0 items-center gap-3 rounded-[5px] bg-[#bd6f3c] px-6 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-white transition duration-200 hover:bg-[#a85f31]"
            >
              Postular al seminario <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
