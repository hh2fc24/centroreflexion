import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSiteUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

const TITLE = "Desprotección y sufrimiento de la infancia en Chile";
const DESCRIPTION =
  "Conversatorio en vivo con Juan Carlos Rauld, Director del Centro de Reflexiones Críticas (CRC). Martes 30 de junio, 20:30 hrs. (Chile).";
const IMAGE_PATH = "/images/jc1.png";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/eventos/desproteccion-infancia",
    ogTitle: `${TITLE} | Centro de Reflexiones Críticas`,
    noIndex: true,
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

const CREDENCIALES = [
  "Doctorando en Trabajo Social, Universidad Rovira i Virgili (España)",
  "Magíster en Filosofía Política Contemporánea, Universidad Diego Portales",
  "Trabajador Social, Universidad Tecnológica Metropolitana",
  "16 años de experiencia en dirección de programas de infancia y gestión pública",
];

const IDEAS_CLAVE = [
  "La desprotección infantil no es ausencia del Estado, sino una forma específica de intervención.",
  "En Chile los niños no están fuera del sistema de protección; están atrapados en él.",
  "Cuando el cuidado se vuelve solo técnico, deja de ser cuidado.",
];

const SEMINARIO_HREF =
  "/seminarios/desproteccion-infancia?utm_source=web&utm_medium=evento-pasado&utm_campaign=seminario-c1";

const FOCO = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bd6f3c]";
const BOTON_PRIMARIO = `inline-flex h-12 items-center justify-center gap-2 rounded-[6px] bg-[#bd6f3c] px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31] ${FOCO}`;
const ENLACE = `inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-[#9f5528] underline decoration-[#bd6f3c]/45 underline-offset-4 transition-colors hover:text-[#171713] ${FOCO}`;
const ETIQUETA = "text-[0.8125rem] font-semibold text-[#9f5528]";
const H2 =
  "crc-serif text-balance text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-[#171713]";
const CONTENEDOR = "mx-auto max-w-[1240px] px-4 sm:px-8 lg:px-12";

export default async function DesproteccionInfanciaEvent() {
  return (
    <div className="bg-[#f8f5ee] text-[#171713]">
      {/* El conversatorio ya pasó: quien llegue acá tiene que encontrar el seminario. */}
      <aside aria-label="Aviso" className="border-b border-[#d8cfc0] bg-[#eee8dc]">
        <div className={`${CONTENEDOR} flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between`}>
          <p className="max-w-[70ch] text-[1rem] leading-[1.6] text-[#171713]">
            <span className="font-semibold">Este conversatorio ya se realizó.</span> Ahora Juan Carlos Rauld dicta el
            seminario en vivo Desprotección de la infancia, desde el 15 de octubre.
          </p>
          <Link href={SEMINARIO_HREF} className={`${BOTON_PRIMARIO} shrink-0`}>
            Ver el seminario <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </aside>

      {/* Hero: texto a la izquierda y el afiche real del conversatorio, completo. */}
      <section className="border-b border-[#d8cfc0]">
        <div className={`${CONTENEDOR} grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-center lg:gap-16 lg:py-20`}>
          <div className="max-w-[620px]">
            <p className={ETIQUETA}>Conversatorio CRC · Realizado el martes 30 de junio de 2026</p>
            <h1 className="crc-serif mt-4 text-balance text-[clamp(2rem,3.2vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
              {TITLE}
            </h1>
            <p className="mt-5 max-w-[56ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">
              Con <span className="font-semibold text-[#171713]">Juan Carlos Rauld</span>, Director del Centro de
              Reflexiones Críticas.
            </p>

            <dl className="mt-8 grid grid-cols-1 border-y border-[#d8cfc0] sm:grid-cols-3">
              {[
                ["Fecha", "Martes 30 de junio"],
                ["Hora", "20:30 hrs. (Chile)"],
                ["Inscripción", "Cerrada"],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  className={`flex items-baseline justify-between gap-4 py-3 sm:block sm:py-4 ${
                    i > 0 ? "border-t border-[#eee8dc] sm:border-l sm:border-t-0 sm:pl-5" : ""
                  }`}
                >
                  <dt className="text-[0.8125rem] text-[#6f675d]">{k}</dt>
                  <dd className="text-right text-[1rem] font-semibold tabular-nums sm:mt-1 sm:text-left">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure>
            <div className="relative mx-auto aspect-[1310/1200] w-full max-w-[460px] overflow-hidden rounded-[6px] border border-[#d8cfc0] bg-[#15120e]">
              <Image
                src={IMAGE_PATH}
                alt={`Afiche del conversatorio "${TITLE}" con Juan Carlos Rauld`}
                fill
                priority
                sizes="(min-width: 1024px) 460px, 100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-3 text-[0.8125rem] text-[#6f675d]">Afiche original del conversatorio.</figcaption>
          </figure>
        </div>
      </section>

      {/* Sobre el conversatorio */}
      <section className={`${CONTENEDOR} py-16 lg:py-24`}>
        <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
          <p className={ETIQUETA}>Sobre el conversatorio</p>
          <div className="max-w-[64ch]">
            <h2 className={H2}>La desprotección como forma de gestión institucional</h2>
            <p className="mt-6 text-[1.0625rem] leading-[1.7]">
              Un encuentro abierto sobre las fallas estructurales del sistema de protección de la infancia en Chile:
              cómo opera la desprotección como una forma activa de gestión institucional, y no como simple ausencia
              del Estado. La conversación tomó como punto de partida la investigación de Juan Carlos Rauld sobre
              biopolítica, dominación y gobierno de la infancia pobre, desarrollada en su libro{" "}
              <Link
                href="/publicaciones"
                className={`font-semibold text-[#9f5528] underline decoration-[#bd6f3c]/45 underline-offset-4 hover:text-[#171713] ${FOCO}`}
              >
                Desprotección de la infancia: Dominación, Biopolítica y Gobierno
              </Link>
              .
            </p>

            <h3 className="mt-10 text-[1rem] font-semibold">Ideas clave</h3>
            <ul className="mt-3 border-t border-[#d8cfc0]">
              {IDEAS_CLAVE.map((idea) => (
                <li key={idea} className="border-b border-[#eee8dc] py-3.5 text-[1rem] leading-[1.65] text-[#55574f]">
                  {idea}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Cita */}
      <section className="bg-[#15120e]">
        <div className={`${CONTENEDOR} py-14 lg:py-20`}>
          <figure className="max-w-[780px]">
            <blockquote>
              <p className="crc-serif text-balance text-[clamp(1.5rem,2.3vw,2.25rem)] leading-[1.3] text-[#fbf7ee]">
                «Chile gobierna a su infancia pobre con tecnocracia, no con cuidado.»
              </p>
            </blockquote>
            <figcaption className="mt-5 text-[0.9375rem] font-semibold text-[#e4935d]">Juan Carlos Rauld</figcaption>
          </figure>
        </div>
      </section>

      {/* Quién expuso */}
      <section className={`${CONTENEDOR} py-16 lg:py-24`}>
        <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
          <p className={ETIQUETA}>Quién expuso</p>
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_260px] md:gap-14">
            <div>
              <h2 className={H2}>Juan Carlos Rauld</h2>
              <p className="mt-2 text-[0.9375rem] font-semibold text-[#55574f]">
                Trabajador Social · Autor · Analista en políticas de infancia
              </p>
              <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-[1.7]">
                Juan Carlos Rauld es Director del Centro de Reflexiones Críticas e investigador especializado en
                infancia, trauma psíquico y biopolítica. Es Magíster en Filosofía Política Contemporánea por la
                Universidad Diego Portales y Trabajador Social de la Universidad Tecnológica Metropolitana, con 16 años
                de experiencia en dirección de programas de infancia y gestión pública en Chile. Actualmente cursa un
                doctorado en Trabajo Social en la Universidad Rovira i Virgili (España), donde profundiza su
                investigación sobre cómo el Estado chileno gobierna —y desprotege— a la infancia pobre.
              </p>

              <ul className="mt-8 border-t border-[#d8cfc0]">
                {CREDENCIALES.map((item) => (
                  <li key={item} className="border-b border-[#eee8dc] py-3 text-[1rem] leading-[1.6] text-[#55574f]">
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href="/conocenos" className={ENLACE}>
                  Ver perfil completo <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <a
                  href="https://uc-cl.academia.edu/JUANCARLOSRAULDFAR%C3%8DAS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[0.9375rem] font-semibold text-[#55574f] underline decoration-[#d8cfc0] underline-offset-4 hover:text-[#9f5528] ${FOCO}`}
                >
                  Academia.edu
                </a>
                <a
                  href="https://www.linkedin.com/in/juan-carlos-rauld-farias-a64710a4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[0.9375rem] font-semibold text-[#55574f] underline decoration-[#d8cfc0] underline-offset-4 hover:text-[#9f5528] ${FOCO}`}
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <div>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[6px] bg-[#eee8dc]">
                <Image
                  src="/images/juan-carlos-rauld-retrato.jpg"
                  alt="Retrato de Juan Carlos Rauld"
                  fill
                  sizes="(min-width: 768px) 260px, 100vw"
                  className="object-cover"
                />
              </div>
              <Link href="/publicaciones" className={`group mt-6 flex gap-4 border-t border-[#d8cfc0] pt-5 ${FOCO}`}>
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[6px] bg-[#eee8dc]">
                  <Image
                    src="/images/book_desproteccion.png"
                    alt="Portada del libro Desprotección de la infancia"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className={ETIQUETA}>El libro detrás del conversatorio</p>
                  <p className="crc-serif mt-1 text-[1.05rem] font-medium leading-[1.3] group-hover:text-[#9f5528]">
                    Desprotección de la infancia: Dominación, Biopolítica y Gobierno
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Siguiente paso: el seminario */}
      <section className="border-t border-[#d8cfc0] bg-[#fffdf8]">
        <div className={`${CONTENEDOR} grid gap-8 py-14 lg:grid-cols-[200px_minmax(0,1fr)_auto] lg:items-end lg:gap-14 lg:py-20`}>
          <p className={`${ETIQUETA} lg:self-start lg:pt-2`}>Inscripción cerrada</p>
          <div className="max-w-[54ch]">
            <h2 className={H2}>El tema continúa en un seminario de ocho sesiones</h2>
            <p className="mt-4 text-[1.0625rem] leading-[1.7] text-[#55574f]">
              El formulario de este conversatorio ya no está activo. Juan Carlos Rauld desarrolla el argumento completo
              en el seminario en vivo, los jueves desde el 15 de octubre. Para enterarte de próximas actividades, sigue
              al CRC en{" "}
              <a
                href="https://www.youtube.com/@CentrodeReflexionesCr%C3%ADticas"
                target="_blank"
                rel="noreferrer"
                className={`font-semibold text-[#9f5528] underline decoration-[#bd6f3c]/45 underline-offset-4 hover:text-[#171713] ${FOCO}`}
              >
                YouTube
              </a>{" "}
              e{" "}
              <a
                href="https://www.instagram.com/centrodereflexionescriticas/"
                target="_blank"
                rel="noreferrer"
                className={`font-semibold text-[#9f5528] underline decoration-[#bd6f3c]/45 underline-offset-4 hover:text-[#171713] ${FOCO}`}
              >
                Instagram
              </a>
              .
            </p>
          </div>
          <Link href={SEMINARIO_HREF} className={`${BOTON_PRIMARIO} shrink-0`}>
            Ver el seminario <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
