import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SeminarioPostulacionForm } from "@/components/SeminarioPostulacionForm";
import { SeminarioPagoAviso, SeminarioPagoButton } from "@/components/SeminarioPagoButton";
import { leerEstadoVenta } from "@/lib/server/seminarioPagosStore";
import {
  SEMINARIO_CUPOS_TOTALES,
  TRAMOS,
  estadoDeTramo,
  fechaCierreLegible,
  formatoCLP,
  mostrarCuposRestantes,
  type EstadoVenta,
} from "@/lib/seminario/tramos";
import { pageMetadata } from "@/lib/seo";

const TITLE = "Seminario · Desprotección de la Infancia";
const DESCRIPTION =
  "Seminario en vivo de 8 sesiones con Juan Carlos Rauld, autor del libro y Director del CRC. Jueves 19:00, del 15 de octubre al 3 de diciembre de 2026. Cohorte cerrada de 15 personas. Certificación CRC + Editorial Hammurabi.";
const IMAGE_PATH = "/images/book_desproteccion.png";
// Imagen editorial de la campaña: corredor institucional vacío con una silla de
// escuela y un libro encima ("institución + infancia ausente"). Es la línea
// editorial del CRC (docs/design-system-crc.md §4) y va limpia, sin texto encima.
const HERO_IMAGE = "/images/desproteccion-institucionalizacion-editorial.png";
// Foto real del relator exponiendo en La Furia del Libro, para "Quién lo dicta".
const RELATOR_IMAGE = "/images/juan-carlos-rauld-furia-del-libro.jpg";

// El tramo vigente y los cupos disponibles se cuentan en cada visita: si la
// página quedara cacheada, seguiría ofreciendo un tramo ya agotado.
export const dynamic = "force-dynamic";

/** Valor de lista, para el tachado cuando el tramo vigente trae descuento. */
const PRECIO_LISTA = TRAMOS[TRAMOS.length - 1].precio;

const PATH = "/seminarios/desproteccion-infancia";
// Imagen 1200×630 generada por ./opengraph-image.tsx (la portada del libro es
// cuadrada y las redes la recortaban).
const OG_IMAGE = `${PATH}/opengraph-image`;

// `title` va sin sufijo: el template de app/layout.tsx ya agrega
// "| Centro de Reflexiones Críticas". El título social sí lo lleva, porque
// Open Graph no pasa por el template.
const baseMetadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  ogTitle: `${TITLE} | Centro de Reflexiones Críticas`,
  keywords: [
    "seminario infancia Chile",
    "biopolítica infancia",
    "Foucault infancia",
    "desprotección infantil",
    "formación protección infancia",
    "Juan Carlos Rauld",
    "SENAME Mejor Niñez formación",
  ],
});

export const metadata: Metadata = {
  ...baseMetadata,
  // Se conservan url, siteName y locale de pageMetadata; solo cambia la imagen.
  openGraph: {
    ...baseMetadata.openGraph,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    ...baseMetadata.twitter,
    images: [OG_IMAGE],
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
    a: "Sí. Tres transferencias sin interés: una antes de comenzar y dos durante el seminario. También puedes pagar con Mercado Pago, usando las cuotas de tu tarjeta.",
  },
  {
    q: "Mi institución quiere inscribir a varias personas.",
    a: "Desde 3 personas de la misma institución, 15% de descuento para cada una, con factura. Si son un equipo de 8 o más, dictamos el seminario en formato cerrado para una sola institución, con fechas propias y factura: escríbenos desde la página de instituciones y armamos la propuesta.",
    link: { href: "/instituciones", label: "Formación para instituciones" },
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
   Clases de la casa (docs/design-system-crc.md).
   Etiquetas en tipo oración, botones sin versalitas, radio 6px,
   filetes en vez de tarjetas y cifras con tabular-nums.
   ──────────────────────────────────────────────────────────── */

const FOCO =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bd6f3c]";
const BOTON_PRIMARIO = `inline-flex h-12 items-center justify-center gap-2 rounded-[6px] bg-[#bd6f3c] px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31] ${FOCO}`;
const BOTON_SECUNDARIO = `inline-flex h-12 items-center justify-center rounded-[6px] border border-[#171713] px-5 text-[0.9375rem] font-semibold text-[#171713] transition-colors hover:bg-[#171713] hover:text-[#fffdf8] ${FOCO}`;
const ENLACE = `inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-[#9f5528] underline decoration-[#bd6f3c]/45 underline-offset-4 transition-colors hover:text-[#171713] hover:decoration-[#171713] ${FOCO}`;
const ETIQUETA = "text-[0.8125rem] font-semibold text-[#9f5528]";
const H2 =
  "crc-serif text-balance text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-[#171713]";
const CONTENEDOR = "mx-auto max-w-[1240px] px-4 sm:px-8 lg:px-12";
const SECCION = `${CONTENEDOR} py-16 lg:py-24`;
const FILETE = "border-[#d8cfc0]";
const FILETE_SUAVE = "border-[#eee8dc]";

/* ────────────────────────────────────────────────────────────
   Textos que dependen del estado de la venta.
   ──────────────────────────────────────────────────────────── */

type Vigente = EstadoVenta["vigente"];

/** Línea del hero: la cifra solo cuando quedan pocos cupos. */
function textoCupos(venta: EstadoVenta) {
  if (venta.disponibles === 0) return "Cohorte 1 completa";
  if (mostrarCuposRestantes(venta.disponibles)) {
    return venta.disponibles === 1
      ? `Queda 1 de ${SEMINARIO_CUPOS_TOTALES} cupos`
      : `Quedan ${venta.disponibles} de ${SEMINARIO_CUPOS_TOTALES} cupos`;
  }
  return `Cohorte cerrada de ${SEMINARIO_CUPOS_TOTALES} personas`;
}

/** Valor del tramo vigente y hasta cuándo rige. */
function plazoTramo(tramo: NonNullable<Vigente>) {
  const esUltimo = tramo.id === TRAMOS[TRAMOS.length - 1].id;
  if (esUltimo) {
    return `Matrícula abierta hasta el ${fechaCierreLegible(tramo)} a las 23:59.`;
  }
  return `Valor ${tramo.nombre} ${formatoCLP(tramo.precio)} hasta el ${fechaCierreLegible(tramo)}, o hasta agotar sus cupos.`;
}

const ESTADO_TEXTO = {
  vigente: "Vigente",
  agotado: "Agotado",
  vencido: "Cerrado",
  proximo: "Próximo",
} as const;

function ResumenHero({ vigente }: { vigente: Vigente }) {
  const items: [string, React.ReactNode][] = [
    ["Inicio", "Jueves 15 de octubre"],
    ["Horario", "Jueves, 19:00 a 21:00"],
    [
      "Valor",
      vigente ? (
        <>
          {formatoCLP(vigente.precio)}{" "}
          {vigente.precio < PRECIO_LISTA ? (
            <span className="whitespace-nowrap font-normal text-[#6f675d] line-through">
              {formatoCLP(PRECIO_LISTA)}
            </span>
          ) : null}
        </>
      ) : (
        "Matrícula cerrada"
      ),
    ],
  ];
  return (
    <dl className={`grid grid-cols-1 border-y ${FILETE} sm:grid-cols-3`}>
      {items.map(([k, v], i) => (
        <div
          key={k}
          className={`flex items-baseline justify-between gap-4 py-3 sm:block sm:py-4 ${
            i > 0 ? `border-t ${FILETE_SUAVE} sm:border-l sm:border-t-0 sm:pl-5` : ""
          }`}
        >
          <dt className="text-[0.8125rem] text-[#6f675d]">{k}</dt>
          <dd className="text-right text-[1rem] font-semibold tabular-nums text-[#171713] sm:mt-1 sm:text-left">
            {v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Encabezado({ etiqueta, children }: { etiqueta: string; children?: React.ReactNode }) {
  return (
    <div>
      <p className={ETIQUETA}>{etiqueta}</p>
      {children}
    </div>
  );
}

export default async function SeminarioDesproteccionInfancia() {
  const venta = await leerEstadoVenta();
  const vigente = venta.vigente;

  return (
    <div className="bg-[#f8f5ee] text-[#171713]">
      <SeminarioPagoAviso />

      {/* ═══ HERO ═══════════════════════════════════════════ */}
      <section className={`border-b ${FILETE}`}>
        <div className={`${CONTENEDOR} grid gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-center lg:gap-16 lg:py-20`}>
          <div className="max-w-[640px]">
            <p className={ETIQUETA}>Seminario en vivo · Cohorte 1 · Octubre a diciembre de 2026</p>

            <h1 className="crc-serif mt-4 text-balance text-[clamp(2rem,3.2vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-[#171713]">
              Desprotección de la infancia
            </h1>

            <p className="crc-serif mt-3 text-balance text-[1.3rem] leading-[1.35] text-[#55574f] sm:text-[1.45rem]">
              Dominación, biopolítica y gobierno de la infancia en Chile
            </p>

            <p className="mt-6 max-w-[60ch] text-[1.0625rem] leading-[1.7] text-[#171713]">
              Ocho sesiones en vivo con Juan Carlos Rauld, autor del libro y Director del CRC. Un recorrido desde
              Foucault hasta el Chile del SENAME para entender por qué la desprotección no es la ausencia del Estado,
              sino una forma específica de gobernar.
            </p>

            <div className="mt-7">
              <ResumenHero vigente={vigente} />
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="#inversion" className={BOTON_PRIMARIO}>
                {vigente ? "Matricularme" : "Lista cohorte 2"} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link href="#programa" className={BOTON_SECUNDARIO}>
                Ver el programa
              </Link>
            </div>

            {/* El contador sale de los pagos aprobados, no de una frase fija. Solo
                se muestra la cifra cuando quedan pocos cupos (ver
                UMBRAL_CUPOS_VISIBLES); antes, el tamaño de la cohorte. */}
            <p className="mt-4 max-w-[60ch] text-[0.9375rem] leading-[1.6] text-[#55574f]">
              <span className="font-semibold text-[#171713]">{textoCupos(venta)}.</span>{" "}
              {vigente ? plazoTramo(vigente) : null}
            </p>

            <div className={`mt-8 flex items-center gap-4 border-t ${FILETE_SUAVE} pt-6`}>
              <div className="relative h-10 w-10 shrink-0">
                <Image
                  src="/images/editorial-hammurabi-logo-transparent.png"
                  alt="Editorial Hammurabi"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <p className="max-w-[46ch] text-[0.875rem] leading-[1.55] text-[#55574f]">
                Certificación conjunta del Centro de Reflexiones Críticas y Editorial Hammurabi, casa editora del
                libro.
              </p>
            </div>
          </div>

          <figure>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[6px] bg-[#eee8dc] lg:aspect-[4/5]">
              <Image
                src={HERO_IMAGE}
                alt="Corredor institucional vacío con una silla de escuela y un libro sobre el asiento"
                fill
                priority
                sizes="(min-width: 1024px) 440px, 100vw"
                className="object-cover object-[46%_center]"
              />
            </div>
            <figcaption className={`mt-4 flex items-center gap-4 border-t ${FILETE_SUAVE} pt-4`}>
              <Link href="/publicaciones" className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[6px] bg-[#eee8dc] ${FOCO}`}>
                <Image
                  src={IMAGE_PATH}
                  alt="Portada del libro Desprotección de la infancia: Dominación, Biopolítica y Gobierno"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </Link>
              <span className="text-[0.875rem] leading-[1.5] text-[#55574f]">
                Basado en el libro{" "}
                <cite className="font-semibold not-italic text-[#171713]">Desprotección de la infancia</cite>{" "}
                (Editorial Hammurabi).
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ═══ FRANJA DE DATOS ════════════════════════════════ */}
      <section className={`border-b ${FILETE} bg-[#fffdf8]`}>
        <dl className={`${CONTENEDOR} grid grid-cols-2 lg:grid-cols-4`}>
          {DATOS.map((d, i) => (
            <div
              key={d.label}
              className={`flex flex-col-reverse justify-end gap-1.5 py-6 lg:py-8 ${
                i % 2 === 1 ? "border-l border-[#eee8dc] pl-5 sm:pl-7" : ""
              } ${i < 2 ? "border-b border-[#eee8dc] lg:border-b-0" : ""} ${
                i === 2 ? "lg:border-l lg:border-[#eee8dc] lg:pl-7" : ""
              }`}
            >
              <dt className="text-[0.9375rem] leading-[1.4] text-[#55574f]">{d.label}</dt>
              <dd className="crc-serif text-[2rem] font-medium leading-none tabular-nums text-[#171713]">{d.valor}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ═══ QUÉ ES ═════════════════════════════════════════ */}
      <section className={SECCION}>
        <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)_300px] lg:gap-14">
          <Encabezado etiqueta="El seminario" />
          <div className="max-w-[62ch]">
            <h2 className={H2}>No es un curso de técnicas. Es un seminario de lectura crítica.</h2>
            <p className="mt-6 text-[1.0625rem] leading-[1.7] text-[#171713]">
              Ocho sesiones para construir, paso a paso, las herramientas conceptuales que permiten leer el sistema
              chileno de protección de la infancia por dentro. Empezamos preguntando qué es un niño para la filosofía
              occidental, pasamos por Foucault y la biopolítica, y terminamos en el Chile concreto de las residencias,
              los programas y los informes.
            </p>
            <p className="mt-5 text-[1.0625rem] leading-[1.7] text-[#171713]">
              Se basa en la investigación publicada en{" "}
              <cite className="font-semibold not-italic">
                Desprotección de la infancia: Dominación, Biopolítica y Gobierno
              </cite>{" "}
              (Editorial Hammurabi). Es la primera vez que el autor lo dicta.
            </p>
            <Link href="/publicaciones" className={`mt-6 ${ENLACE}`}>
              Ver los libros de Juan Carlos <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <aside className={`border-t ${FILETE} pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0`}>
            <p className={ETIQUETA}>En qué se diferencia del catálogo</p>
            <p className="mt-3 text-[0.9375rem] leading-[1.7] text-[#55574f]">
              Los cursos de la Academia CRC son asincrónicos y de acceso abierto. Este seminario es en vivo, con una
              cohorte cerrada de quince personas, discusión de casos reales, ensayo final con retroalimentación
              individual y el autor del libro conduciendo cada sesión.
            </p>
            <p className="mt-3 text-[0.9375rem] leading-[1.7] text-[#55574f]">
              Por eso tiene su propio valor y su propio cupo.
            </p>

            <dl className={`mt-6 border-t ${FILETE}`}>
              {[
                ["Formato", "En vivo, por Zoom"],
                ["Cohorte", "15 personas"],
                ["Evaluación", "Ensayo final con devolución"],
              ].map(([k, v]) => (
                <div key={k} className={`flex items-baseline justify-between gap-4 border-b ${FILETE_SUAVE} py-3`}>
                  <dt className="text-[0.875rem] text-[#6f675d]">{k}</dt>
                  <dd className="text-right text-[0.9375rem] font-semibold tabular-nums text-[#171713]">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* ═══ CITA ═══════════════════════════════════════════ */}
      <section className="bg-[#15120e]">
        <div className={`${CONTENEDOR} py-16 lg:py-20`}>
          <figure className="max-w-[780px]">
            <blockquote>
              <p className="crc-serif text-balance text-[clamp(1.5rem,2.3vw,2.25rem)] font-normal leading-[1.3] text-[#fbf7ee]">
                «Chile gobierna a su infancia pobre con tecnocracia, no con cuidado.»
              </p>
            </blockquote>
            <figcaption className="mt-5 text-[0.9375rem] font-semibold text-[#e4935d]">
              Juan Carlos Rauld, autor del libro
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ═══ PARA QUIÉN ═════════════════════════════════════ */}
      <section className={SECCION}>
        <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
          <Encabezado etiqueta="Perfil" />
          <div>
            <h2 className={`${H2} max-w-[22ch]`}>Para quién es, y para quién no.</h2>

            <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <p className={`border-b ${FILETE} pb-3 text-[0.9375rem] font-semibold text-[#171713]`}>
                  Pensado para
                </p>
                <ul>
                  {PARA_QUIEN_SI.map((item) => (
                    <li
                      key={item}
                      className={`border-b ${FILETE_SUAVE} py-3.5 text-[1rem] leading-[1.6] text-[#171713]`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={`border-b ${FILETE} pb-3 text-[0.9375rem] font-semibold text-[#55574f]`}>
                  No es para ti
                </p>
                <ul>
                  {PARA_QUIEN_NO.map((item) => (
                    <li
                      key={item}
                      className={`border-b ${FILETE_SUAVE} py-3.5 text-[1rem] leading-[1.6] text-[#55574f]`}
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
      <section id="programa" className={`scroll-mt-24 border-y ${FILETE} bg-[#fffdf8]`}>
        <div className={SECCION}>
          <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
            <Encabezado etiqueta="Programa">
              <p className="mt-3 max-w-[30ch] text-[0.9375rem] leading-[1.6] text-[#55574f]">
                Todos los jueves de 19:00 a 21:00, del 15 de octubre al 3 de diciembre de 2026. Ninguna sesión cae en
                feriado.
              </p>
            </Encabezado>

            <div>
              <h2 className={H2}>Ocho sesiones, de la filosofía de la infancia al Chile de hoy</h2>
              <ol className={`mt-8 border-t ${FILETE}`}>
                {SESIONES.map((s) => (
                  <li
                    key={s.n}
                    className={`grid gap-x-8 gap-y-1.5 border-b ${FILETE_SUAVE} py-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:py-6`}
                  >
                    <div className="flex items-baseline gap-3 sm:block">
                      <p className="text-[0.9375rem] font-semibold tabular-nums text-[#171713]">{s.fecha}</p>
                      <p className="text-[0.8125rem] tabular-nums text-[#6f675d] sm:mt-1">
                        Sesión {Number(s.n)} de {SESIONES.length}
                      </p>
                    </div>
                    <div>
                      <h3 className="crc-serif text-[1.3rem] font-medium leading-[1.25] text-[#171713] sm:text-[1.35rem]">
                        {s.titulo}
                      </h3>
                      <p className="mt-1.5 max-w-[62ch] text-[1rem] leading-[1.65] text-[#55574f]">{s.detalle}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 grid gap-x-8 gap-y-2 sm:grid-cols-[150px_minmax(0,1fr)]">
                <p className="text-[0.9375rem] font-semibold text-[#9f5528]">Ensayo final</p>
                <p className="max-w-[62ch] text-[1rem] leading-[1.7] text-[#55574f]">
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
      <section className={SECCION}>
        <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
          <Encabezado etiqueta="Quién lo dicta" />

          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_280px] md:gap-14">
            <div>
              <h2 className={H2}>Juan Carlos Rauld</h2>
              <p className="mt-2 text-[0.9375rem] font-semibold text-[#55574f]">
                Director del CRC · Trabajador Social · Autor del libro
              </p>

              <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-[#171713]">
                Investigador especializado en infancia, trauma psíquico y biopolítica. Magíster en Filosofía Política
                Contemporánea por la Universidad Diego Portales y Trabajador Social de la Universidad Tecnológica
                Metropolitana, con dieciséis años de experiencia en dirección de programas de infancia y gestión
                pública en Chile. Actualmente cursa un doctorado en Trabajo Social en la Universidad Rovira i Virgili,
                donde profundiza su investigación sobre cómo el Estado chileno gobierna —y desprotege— a la infancia
                pobre.
              </p>

              <ul className={`mt-8 border-t ${FILETE}`}>
                {CREDENCIALES.map((item) => (
                  <li key={item} className={`border-b ${FILETE_SUAVE} py-3 text-[1rem] leading-[1.6] text-[#55574f]`}>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href="/conocenos" className={ENLACE}>
                  Perfil completo <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <a
                  href="https://uc-cl.academia.edu/JUANCARLOSRAULDFAR%C3%8DAS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[0.9375rem] font-semibold text-[#55574f] underline decoration-[#d8cfc0] underline-offset-4 transition-colors hover:text-[#9f5528] ${FOCO}`}
                >
                  Academia.edu
                </a>
                <a
                  href="https://www.linkedin.com/in/juan-carlos-rauld-farias-a64710a4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[0.9375rem] font-semibold text-[#55574f] underline decoration-[#d8cfc0] underline-offset-4 transition-colors hover:text-[#9f5528] ${FOCO}`}
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <div>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[6px] bg-[#eee8dc]">
                <Image
                  src={RELATOR_IMAGE}
                  alt="Juan Carlos Rauld exponiendo con micrófono en La Furia del Libro"
                  fill
                  sizes="(min-width: 768px) 280px, 100vw"
                  className="object-cover object-[68%_30%]"
                />
              </div>
              <p className="mt-3 text-[0.8125rem] leading-[1.5] text-[#6f675d]">
                Juan Carlos Rauld, relator del seminario, en La Furia del Libro.
              </p>

              <Link href="/publicaciones" className={`group mt-6 flex gap-4 border-t ${FILETE} pt-5 ${FOCO}`}>
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[6px] bg-[#eee8dc]">
                  <Image
                    src={IMAGE_PATH}
                    alt="Portada del libro Desprotección de la infancia"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div>
                  <p className={ETIQUETA}>El libro del seminario</p>
                  <p className="crc-serif mt-1 text-[1.1rem] font-medium leading-[1.25] text-[#171713]">
                    Desprotección de la infancia
                  </p>
                  <p className="mt-1 text-[0.875rem] text-[#6f675d]">Editorial Hammurabi</p>
                  <p className="mt-2 text-[0.875rem] font-semibold text-[#9f5528] underline decoration-[#bd6f3c]/45 underline-offset-4 group-hover:text-[#171713]">
                    Ver los libros de Juan Carlos
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ INVERSIÓN ══════════════════════════════════════ */}
      <section id="inversion" className={`scroll-mt-24 border-y ${FILETE} bg-[#fffdf8]`}>
        <div className={SECCION}>
          <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
            <Encabezado etiqueta="Inversión">
              <p className="mt-3 max-w-[30ch] text-[0.9375rem] leading-[1.6] text-[#55574f]">
                El valor sube por tramos de cupo. Cuando se agotan los cinco cupos de un tramo, el tramo se cierra
                aunque la fecha todavía no haya llegado.
              </p>
              <p className="mt-3 max-w-[30ch] text-[0.9375rem] leading-[1.6] text-[#55574f]">
                Solo el tramo vigente se puede pagar. El valor lo calcula el sitio según los cupos ya tomados.
              </p>
            </Encabezado>

            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h2 className={H2}>Valor y matrícula</h2>
                <p className="text-[0.9375rem] font-semibold tabular-nums text-[#55574f]">
                  {mostrarCuposRestantes(venta.disponibles)
                    ? `${venta.disponibles} ${venta.disponibles === 1 ? "cupo disponible" : "cupos disponibles"} de ${SEMINARIO_CUPOS_TOTALES}`
                    : venta.disponibles === 0
                      ? "Cohorte 1 completa"
                      : `Cohorte cerrada de ${SEMINARIO_CUPOS_TOTALES} personas`}
                </p>
              </div>

              {/* Tabla de tramos: una fila por tramo, valor alineado a la derecha. */}
              <div className="mt-8">
                <div
                  aria-hidden="true"
                  className={`hidden border-b ${FILETE} pb-2 text-[0.8125rem] text-[#6f675d] sm:grid sm:grid-cols-[minmax(0,1fr)_110px_minmax(0,1.3fr)_150px] sm:gap-x-6`}
                >
                  <span>Tramo</span>
                  <span>Cupos</span>
                  <span>Vigencia</span>
                  <span className="text-right">Valor</span>
                </div>
                <ol className={`border-t ${FILETE} sm:border-t-0`}>
                  {TRAMOS.map((t) => {
                    const estado = estadoDeTramo(t, venta);
                    const activo = estado === "vigente";
                    const cerrado = estado === "agotado" || estado === "vencido";
                    return (
                      <li
                        key={t.id}
                        className={`grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 border-b ${FILETE_SUAVE} py-4 sm:grid-cols-[minmax(0,1fr)_110px_minmax(0,1.3fr)_150px] sm:py-5 ${
                          activo ? "bg-[#f8f5ee] sm:-mx-4 sm:px-4" : ""
                        }`}
                      >
                        <div>
                          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <span
                              className={`text-[1.0625rem] font-semibold ${
                                cerrado ? "text-[#6f675d]" : "text-[#171713]"
                              }`}
                            >
                              {t.nombre}
                            </span>
                            <span
                              className={
                                activo
                                  ? "rounded-[6px] bg-[#bd6f3c] px-2 py-0.5 text-[0.8125rem] font-semibold text-white"
                                  : "text-[0.8125rem] text-[#6f675d]"
                              }
                            >
                              {ESTADO_TEXTO[estado]}
                            </span>
                          </p>
                          <p className="mt-1 text-[0.875rem] leading-[1.5] tabular-nums text-[#55574f] sm:hidden">
                            Cupos {t.desde} a {t.hasta} · hasta el {fechaCierreLegible(t)}
                          </p>
                        </div>
                        <p className="hidden text-[0.9375rem] tabular-nums text-[#55574f] sm:block">
                          {t.desde} a {t.hasta}
                        </p>
                        <p className="hidden text-[0.9375rem] leading-[1.5] text-[#55574f] sm:block">
                          Hasta el {fechaCierreLegible(t)}
                        </p>
                        <div className="text-right">
                          <p
                            className={`text-[1.25rem] font-semibold tabular-nums ${
                              cerrado ? "text-[#6f675d] line-through decoration-1" : "text-[#171713]"
                            }`}
                          >
                            {formatoCLP(t.precio)}
                          </p>
                          <p
                            className={`mt-0.5 text-[0.8125rem] tabular-nums ${
                              activo ? "font-semibold text-[#9f5528]" : "text-[#6f675d]"
                            }`}
                          >
                            {t.ahorro}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Matrícula: solo el tramo vigente se puede pagar. */}
              <div
                className={`mt-8 grid gap-6 rounded-[6px] border ${FILETE} bg-[#f8f5ee] p-5 sm:p-7 md:grid-cols-[minmax(0,1fr)_320px] md:gap-10`}
              >
                {vigente ? (
                  <>
                    <div>
                      <p className={ETIQUETA}>Tramo vigente: {vigente.nombre}</p>
                      <p className="mt-2 flex flex-wrap items-baseline gap-x-3">
                        <span className="crc-serif text-[2.25rem] font-medium leading-none tabular-nums text-[#171713]">
                          {formatoCLP(vigente.precio)}
                        </span>
                        {vigente.precio < PRECIO_LISTA ? (
                          <span className="text-[1rem] tabular-nums text-[#6f675d] line-through">
                            {formatoCLP(PRECIO_LISTA)}
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-3 max-w-[48ch] text-[0.9375rem] leading-[1.6] text-[#55574f]">
                        {plazoTramo(vigente)}
                      </p>
                    </div>
                    <div className="md:pt-1">
                      <SeminarioPagoButton precioLabel={formatoCLP(vigente.precio)} tramoNombre={vigente.nombre} />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className={ETIQUETA}>Matrícula cerrada</p>
                      <p className="mt-2 max-w-[48ch] text-[1rem] leading-[1.6] text-[#171713]">
                        {venta.disponibles === 0
                          ? "La cohorte 1 está completa. Postula y quedas primero en la lista de la cohorte 2, con el precio de la cohorte 1 congelado."
                          : "La matrícula de la cohorte 1 ya cerró. Postula y quedas primero en la lista de la cohorte 2."}
                      </p>
                    </div>
                    <div className="md:pt-1">
                      <Link href="#postular" className={`${BOTON_PRIMARIO} w-full`}>
                        Lista cohorte 2 <ArrowRight aria-hidden="true" className="h-4 w-4" />
                      </Link>
                    </div>
                  </>
                )}
              </div>

              <div className={`mt-10 grid gap-8 border-t ${FILETE} pt-8 sm:grid-cols-2 sm:gap-12`}>
                <div>
                  <h3 className="text-[1rem] font-semibold text-[#171713]">Puedes pagar en tres cuotas</h3>
                  <p className="mt-2 text-[1rem] leading-[1.65] text-[#55574f]">
                    Tres transferencias sin interés: una antes de comenzar y dos durante el seminario. También Mercado
                    Pago, con las cuotas de tu tarjeta.
                  </p>
                </div>
                <div>
                  <h3 className="text-[1rem] font-semibold text-[#171713]">Convenio institucional</h3>
                  <p className="mt-2 text-[1rem] leading-[1.65] text-[#55574f]">
                    Desde tres personas de la misma institución, 15% de descuento para cada una y factura.
                  </p>
                  <p className="mt-2 text-[1rem] leading-[1.65] text-[#55574f]">
                    ¿Son un equipo de 8 o más? Dictamos el seminario en formato cerrado para una sola institución, con
                    fechas propias y factura.{" "}
                    <Link
                      href="/instituciones"
                      className={`font-semibold text-[#9f5528] underline decoration-[#bd6f3c]/45 underline-offset-4 transition-colors hover:text-[#171713] ${FOCO}`}
                    >
                      Escríbenos y armamos la propuesta
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <p className={`mt-8 border-t ${FILETE} pt-6 text-[1rem] leading-[1.65] text-[#55574f]`}>
                <span className="font-semibold text-[#171713]">
                  La matrícula cierra el martes 13 de octubre a las 23:59
                </span>
                , o antes si se completan los quince cupos. No reabrimos: la cohorte 2 se abre en marzo de 2027.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ POSTULACIÓN ════════════════════════════════════ */}
      <section id="postular" className="scroll-mt-24">
        <div className={SECCION}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_500px] lg:gap-16">
            <div>
              <p className={ETIQUETA}>Postulación</p>
              <h2 className={`${H2} mt-3 max-w-[20ch]`}>Quince personas, una cohorte.</h2>
              <p className="mt-5 max-w-[56ch] text-[1.0625rem] leading-[1.7] text-[#171713]">
                Revisamos cada postulación. Si tu perfil calza con la cohorte, te escribimos para una conversación
                breve de quince minutos y confirmamos tu cupo con el valor del tramo vigente. Postular no compromete
                pago.
              </p>

              <dl className={`mt-8 max-w-[520px] border-t ${FILETE}`}>
                {[
                  ["Inicio", "Jueves 15 de octubre, 19:00"],
                  ["Cierre de matrícula", "Martes 13 de octubre, 23:59"],
                  ["Grabaciones", "Disponibles 60 días"],
                  ["Certificación", "CRC + Editorial Hammurabi"],
                ].map(([k, v]) => (
                  <div key={k} className={`flex items-baseline justify-between gap-6 border-b ${FILETE_SUAVE} py-3.5`}>
                    <dt className="text-[0.9375rem] text-[#55574f]">{k}</dt>
                    <dd className="text-right text-[1rem] font-semibold tabular-nums text-[#171713]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-[6px] border border-[#ded5c7] bg-[#fffdf8] p-5 sm:p-8">
              <h3 className="crc-serif text-[1.35rem] font-medium leading-[1.2] text-[#171713]">
                Formulario de postulación
              </h3>
              <p className="mb-6 mt-1.5 text-[0.9375rem] leading-[1.55] text-[#55574f]">
                Todos los campos son obligatorios.
              </p>
              <SeminarioPostulacionForm variant="light" />

              {vigente ? (
                <div className={`mt-7 border-t ${FILETE_SUAVE} pt-6`}>
                  <p className="text-[0.9375rem] leading-[1.6] text-[#55574f]">
                    ¿Ya lo tienes decidido? Puedes reservar tu cupo pagando ahora, sin pasar por la postulación.
                  </p>
                  <div className="mt-4">
                    <SeminarioPagoButton precioLabel={formatoCLP(vigente.precio)} tramoNombre={vigente.nombre} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ════════════════════════════════════════════ */}
      <section id="preguntas" className={`scroll-mt-24 border-t ${FILETE} bg-[#fffdf8]`}>
        <div className={SECCION}>
          <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
            <Encabezado etiqueta="Preguntas frecuentes" />
            <div className={`border-t ${FILETE}`}>
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className={`group border-b ${FILETE_SUAVE} [&_summary::-webkit-details-marker]:hidden`}
                >
                  <summary
                    className={`flex cursor-pointer list-none items-baseline justify-between gap-6 rounded-[6px] py-5 ${FOCO}`}
                  >
                    <span className="crc-serif text-[1.2rem] font-medium leading-[1.35] text-[#171713] transition-colors group-open:text-[#9f5528] sm:text-[1.3rem]">
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-[1.25rem] leading-none text-[#9f5528] motion-safe:transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="pb-6">
                    <p className="max-w-[62ch] text-[1rem] leading-[1.7] text-[#55574f]">{item.a}</p>
                    {item.link ? (
                      <Link href={item.link.href} className={`mt-3 ${ENLACE}`}>
                        {item.link.label} <ArrowRight aria-hidden="true" className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CIERRE ═════════════════════════════════════════ */}
      <section className={`border-t ${FILETE} bg-[#eee8dc]`}>
        <div className={`${CONTENEDOR} py-14 lg:py-20`}>
          <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)_auto] lg:items-end lg:gap-14">
            <p className={`${ETIQUETA} lg:self-start lg:pt-2`}>Cohorte 1</p>
            <div className="max-w-[48ch]">
              <h2 className={H2}>Es la primera vez que el autor dicta este seminario.</h2>
              <p className="mt-4 text-[1.0625rem] leading-[1.7] text-[#55574f]">
                La cohorte 1 se cierra el martes 13 de octubre a las 23:59, o antes si se completan los quince cupos.
                {mostrarCuposRestantes(venta.disponibles)
                  ? ` ${venta.disponibles === 1 ? "Queda 1 cupo" : `Quedan ${venta.disponibles} cupos`}.`
                  : null}
              </p>
            </div>
            <Link href={vigente ? "#inversion" : "#postular"} className={`${BOTON_PRIMARIO} shrink-0`}>
              {vigente ? "Matricularme" : "Lista cohorte 2"} <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
