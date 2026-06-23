import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, Instagram, Radio, Youtube } from "lucide-react";
import { DesproteccionRegistrationForm } from "@/components/DesproteccionRegistrationForm";
import { getSiteUrl } from "@/lib/site";

const TITLE = "Desprotección y sufrimiento de la infancia en Chile";
const DESCRIPTION =
  "Conversatorio en vivo con Juan Carlos Rauld, Director del Centro de Reflexiones Críticas (CRC). Martes 30 de junio, 20:30 hrs. (Chile). Inscripción gratuita.";
const IMAGE_PATH = "/images/jc1.png";

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

export default function DesproteccionInfanciaEvent() {
  return (
    <div className="bg-[#fffdf8] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-14">
          {/* Left: flyer + details */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-slate-950 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                Conversatorio
              </span>
              <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                Centro de Reflexiones Críticas (CRC)
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#171713] sm:text-4xl lg:text-5xl">
              {TITLE}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              Un encuentro abierto sobre las fallas del sistema de protección de la infancia en Chile, con{" "}
              <span className="font-semibold text-slate-950">Juan Carlos Rauld</span>, Director del Centro de
              Reflexiones Críticas.
            </p>

            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-black/8 bg-white p-3 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
              <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[1.1rem] bg-[linear-gradient(180deg,#f3efe6_0%,#e7e1d6_100%)] sm:aspect-[4/3]">
                <Image
                  src={IMAGE_PATH}
                  alt={`Afiche del conversatorio "${TITLE}" con Juan Carlos Rauld`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 600px, 92vw"
                  className="object-contain object-center"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <InfoCard icon={CalendarDays} label="Fecha" value="Martes 30 de junio" />
              <InfoCard icon={Clock3} label="Hora" value="20:30 hrs. (Chile)" />
              <InfoCard icon={Radio} label="Formato" value="Streaming en vivo" />
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-black/8 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.3)]">
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
            </div>
          </div>

          {/* Right: registration form */}
          <div className="lg:sticky lg:top-24">
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
