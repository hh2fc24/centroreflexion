import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  Instagram,
  Linkedin,
  Quote,
  Radio,
  Youtube,
} from "lucide-react";
import { CountdownStrip, LiveStreamBadge } from "@/components/DesproteccionEventMeta";
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

export default async function DesproteccionInfanciaEvent() {
  return (
    <div className="bg-[#fffdf8]">
      {/* Hero en dos columnas: texto a la izquierda, afiche completo a la derecha (sin superposiciones) */}
      <div className="relative w-full overflow-hidden bg-slate-950">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
          {/* Columna de texto */}
          <div className="flex flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
            <div className="flex flex-wrap gap-2">
              <LiveStreamBadge />
            </div>

            <span className="mt-6 inline-flex w-fit items-center rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-950">
              Conversatorio · CRC
            </span>
            <h1 className="mt-4 max-w-xl text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
              {TITLE}
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-300 sm:text-lg">
              Con <span className="font-semibold text-white">Juan Carlos Rauld</span>, Director del Centro de
              Reflexiones Críticas.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white/12 px-6 text-sm font-semibold text-white ring-1 ring-white/15"
              >
                Inscripciones cerradas
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-300">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Martes 30 de junio
              </span>
              <span className="hidden text-slate-600 sm:inline">·</span>
              <span className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" /> 20:30 hrs. (Chile)
              </span>
            </div>
          </div>

          {/* Columna de imagen: afiche completo, sin recortes */}
          <div className="relative min-h-[360px] overflow-hidden bg-slate-950 sm:min-h-[440px] lg:min-h-[620px]">
            <Image
              src={IMAGE_PATH}
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="scale-125 object-cover object-center opacity-45 blur-3xl"
            />
            <div className="absolute inset-0 bg-slate-950/30" />
            <Image
              src={IMAGE_PATH}
              alt={`Afiche del conversatorio "${TITLE}" con Juan Carlos Rauld`}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain object-center p-5 sm:p-8"
            />
          </div>
        </div>
      </div>

      {/* Contenido editorial + formulario */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
          <div>
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-[#171713] sm:text-3xl">Sobre el conversatorio</h2>
              <p className="mt-4 text-base leading-7 text-slate-700">
                Un encuentro abierto sobre las fallas estructurales del sistema de protección de la infancia en
                Chile: cómo opera la desprotección como una forma activa de gestión institucional, y no como simple
                ausencia del Estado. La conversación toma como punto de partida la investigación de Juan Carlos
                Rauld sobre biopolítica, dominación y gobierno de la infancia pobre, desarrollada en su libro{" "}
                <Link href="/publicaciones" className="font-semibold text-slate-950 underline">
                  Desprotección de la infancia: Dominación, Biopolítica y Gobierno
                </Link>
                .
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <InfoCard icon={CalendarDays} label="Fecha" value="Martes 30 de junio" />
                <InfoCard icon={Clock3} label="Hora" value="20:30 hrs. (Chile)" />
                <InfoCard icon={Radio} label="Formato" value="Streaming en vivo" />
              </div>

              <div className="mt-6 rounded-2xl border border-black/8 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Cuenta atrás</p>
                <div className="mt-3 max-w-xs">
                  <CountdownStrip dark={false} />
                </div>
              </div>
            </section>

            <section className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[#171713] sm:text-3xl">Quién expone</h2>

              <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl border border-black/8 bg-white sm:h-40 sm:w-40">
                  <Image src="/JC.jpeg" alt="Juan Carlos Rauld" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#171713]">Juan Carlos Rauld</h3>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#bd6f3c]">
                    Trabajador Social · Autor · Analista en políticas de infancia
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#171713]/5 px-3 py-1 text-xs font-semibold text-[#171713]">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Doctorando en Trabajo Social, Universidad Rovira i Virgili (España)
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    Juan Carlos Rauld es Director del Centro de Reflexiones Críticas e investigador especializado en
                    infancia, trauma psíquico y biopolítica. Es Magíster en Filosofía Política Contemporánea por la
                    Universidad Diego Portales y Trabajador Social de la Universidad Tecnológica Metropolitana, con
                    16 años de experiencia en dirección de programas de infancia y gestión pública en Chile.
                    Actualmente cursa un doctorado en Trabajo Social en la Universidad Rovira i Virgili (España), donde
                    profundiza su investigación sobre cómo el Estado chileno gobierna —y desprotege— a la infancia
                    pobre. Es autor del libro{" "}
                    <Link href="/publicaciones" className="font-semibold text-slate-950 underline">
                      Desprotección de la infancia: Dominación, Biopolítica y Gobierno
                    </Link>
                    , que sirve de base a este conversatorio.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link
                      href="/conocenos"
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-950 px-4 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-slate-800"
                    >
                      Ver perfil completo
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <a
                      href="https://uc-cl.academia.edu/JUANCARLOSRAULDFAR%C3%8DAS"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-black/12 px-4 text-xs font-bold uppercase tracking-[0.1em] text-slate-700 transition hover:bg-slate-100"
                    >
                      <GraduationCap className="h-3.5 w-3.5" />
                      Academia.edu
                    </a>
                    <a
                      href="https://www.linkedin.com/in/juan-carlos-rauld-farias-a64710a4/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 transition hover:text-[#bd6f3c]"
                      aria-label="LinkedIn de Juan Carlos Rauld"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {CREDENCIALES.map((item) => (
                  <div key={item} className="rounded-xl border border-black/8 bg-white px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>

              <blockquote className="mt-8 rounded-2xl border border-black/8 bg-slate-950 p-6 text-white">
                <Quote className="h-6 w-6 text-cyan-300" />
                <p className="mt-3 text-lg font-medium leading-7">
                  Chile gobierna a su infancia pobre con tecnocracia, no con cuidado.
                </p>
              </blockquote>

              <div className="mt-6 space-y-3">
                {IDEAS_CLAVE.map((idea) => (
                  <p key={idea} className="border-l-2 border-[#bd6f3c] pl-4 text-sm leading-6 text-slate-700">
                    {idea}
                  </p>
                ))}
              </div>

              <Link
                href="/publicaciones"
                className="mt-8 flex items-center gap-4 rounded-2xl border border-black/8 bg-white p-4 transition hover:border-black/20"
              >
                <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-md border border-black/8">
                  <Image src="/images/book_desproteccion.png" alt="Portada del libro Desprotección de la infancia" fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">El libro detrás del conversatorio</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-950">
                    <BookOpen className="h-4 w-4" />
                    Desprotección de la infancia: Dominación, Biopolítica y Gobierno
                  </p>
                </div>
              </Link>
            </section>

            <section className="mt-14 rounded-2xl border border-black/8 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Sigue la transmisión</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Puedes seguir nuestras cuentas para no perderte el aviso de inicio y las próximas actividades del
                Centro de Reflexiones Críticas.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="https://www.youtube.com/@CentrodeReflexionesCr%C3%ADticas"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#fffdf8] px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  <Youtube className="h-4 w-4 text-red-600" />
                  YouTube
                </Link>
                <Link
                  href="https://www.instagram.com/centrodereflexionescriticas/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#fffdf8] px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  <Instagram className="h-4 w-4 text-pink-600" />
                  Instagram
                </Link>
              </div>
            </section>
          </div>

          {/* Estado de inscripción */}
          <div id="inscripcion" className="lg:sticky lg:top-24">
            <div className="rounded-[1.5rem] border border-black/8 bg-slate-950 p-6 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                <Radio className="h-3.5 w-3.5 text-cyan-300" />
                Inscripción cerrada
              </div>
              <h2 className="mt-3.5 text-2xl font-semibold tracking-tight text-white">Formulario no disponible</h2>
              <p className="mt-1.5 text-sm leading-6 text-slate-300">
                El formulario de inscripción ya no está activo en el sitio. Te invitamos a seguir las redes del CRC
                para recibir avisos de próximas actividades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.25)]">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        <Icon className="h-4 w-4 text-slate-700" />
        {label}
      </div>
      <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}
