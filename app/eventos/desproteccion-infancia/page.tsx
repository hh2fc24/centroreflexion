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
import { DesproteccionRegistrationForm } from "@/components/DesproteccionRegistrationForm";
import { CountdownStrip, LiveCountBadge, LiveStreamBadge } from "@/components/DesproteccionEventMeta";
import { readDesproteccionEventRegistrations } from "@/lib/server/eventRegistrations";
import { getSiteUrl } from "@/lib/site";

const TITLE = "Desprotección y sufrimiento de la infancia en Chile";
const DESCRIPTION =
  "Conversatorio en vivo con Juan Carlos Rauld, Director del Centro de Reflexiones Críticas (CRC). Martes 30 de junio, 20:30 hrs. (Chile). Inscripción gratuita.";
const IMAGE_PATH = "/images/jc1.png";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: `${TITLE} | Centro de Reflexiones Críticas`,
    description: DESCRIPTION,
    images: [{ url: `${getSiteUrl()}${IMAGE_PATH}` }],
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
  let initialCount = 0;
  try {
    const data = await readDesproteccionEventRegistrations();
    initialCount = data.count;
  } catch {
    // El badge en cliente seguirá intentando obtener el conteo.
  }

  return (
    <div className="bg-[#fffdf8]">
      {/* Hero a sangre con el afiche real */}
      <div className="relative h-[78vh] min-h-[420px] w-full overflow-hidden sm:h-[80vh] lg:h-[86vh]">
        <Image
          src={IMAGE_PATH}
          alt={`Afiche del conversatorio "${TITLE}" con Juan Carlos Rauld`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_18%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-6">
          <div className="flex flex-wrap gap-2">
            <LiveStreamBadge />
            <LiveCountBadge seed={initialCount} />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-12">
          <div className="mx-auto max-w-6xl">
            <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-950">
              Conversatorio · CRC
            </span>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {TITLE}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
              Con <span className="font-semibold text-white">Juan Carlos Rauld</span>, Director del Centro de
              Reflexiones Críticas.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#inscripcion"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-cyan-400 px-6 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-cyan-300"
              >
                Inscribirme para participar
                <ArrowRight className="h-4 w-4" />
              </a>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <CalendarDays className="h-4 w-4" /> Martes 30 de junio
                <span className="text-slate-500">·</span>
                <Clock3 className="h-4 w-4" /> 20:30 hrs. (Chile)
              </div>
            </div>
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
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    Investigador del Centro de Reflexiones Críticas. Sus áreas de interés son el trauma psíquico
                    infantil y la biopolítica de la infancia pobre en Chile. Doctorando en Trabajo Social en la
                    Universidad Rovira i Virgili (España).
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
                Enviaremos el enlace directo de la transmisión por correo a quienes se inscriban. También puedes
                seguir nuestras cuentas para no perderte el aviso de inicio.
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

          {/* Formulario */}
          <div id="inscripcion" className="lg:sticky lg:top-24">
            <div className="rounded-[1.5rem] border border-black/8 bg-slate-950 p-6 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                <Radio className="h-3.5 w-3.5 text-cyan-300" />
                Inscripción gratuita
              </div>
              <h2 className="mt-3.5 text-2xl font-semibold tracking-tight text-white">Reserva tu cupo</h2>
              <p className="mt-1.5 text-sm leading-6 text-slate-300">
                Completa tus datos y te enviaremos el link de acceso a la transmisión antes del evento.
              </p>
              <div className="mt-4">
                <DesproteccionRegistrationForm variant="dark" />
              </div>
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
