"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Clock3, Radio, X } from "lucide-react";
import { DesproteccionRegistrationForm } from "@/components/DesproteccionRegistrationForm";

const IMAGE_SRC = "/images/jc1.png";
const DISMISS_KEY = "crc.evento.desproteccion.dismissed.session";
const REGISTERED_KEY = "crc.evento.desproteccion.registered";

export function DesproteccionEventModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/eventos/desproteccion-infancia");

  useEffect(() => {
    if (isAdmin) return;
    if (typeof window === "undefined") return;

    const dismissed = window.sessionStorage.getItem(DISMISS_KEY) === "1";
    const registered = window.localStorage.getItem(REGISTERED_KEY) === "1";
    if (registered || dismissed) return;

    const timer = window.setTimeout(() => setOpen(true), 320);
    return () => window.clearTimeout(timer);
  }, [isAdmin]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      window.sessionStorage.setItem(DISMISS_KEY, "1");
      setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open || isAdmin) return null;

  const close = () => {
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem(DISMISS_KEY, "1");
      } catch {
        // Ignore storage failures; they should not block closing the modal.
      }
    }
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-slate-950/72 p-3 backdrop-blur-md sm:p-4">
      <div className="absolute inset-0" onClick={close} aria-hidden="true" />

      <section className="relative z-10 mx-auto my-0 w-full max-w-[860px] rounded-[1.5rem] border border-white/12 bg-[linear-gradient(135deg,#f7f4ee_0%,#f1ede5_48%,#e7e2d8_100%)] text-slate-950 shadow-[0_40px_120px_-35px_rgba(15,23,42,0.55)] sm:my-4">
        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/72 text-slate-700 shadow-sm transition hover:bg-white"
          aria-label="Cerrar invitación"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_296px]">
          <div className="relative overflow-hidden border-b border-black/6 p-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.1),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_28%)]" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-slate-950 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
                  Conversatorio
                </span>
                <span className="inline-flex items-center rounded-full border border-black/10 bg-white/72 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  Centro de Reflexiones Críticas
                </span>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[264px_minmax(0,1fr)] lg:items-center">
                <div className="mx-auto w-full max-w-[264px]">
                  <div className="overflow-hidden rounded-[1.4rem] border border-black/8 bg-white/78 p-2.5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.38)]">
                    <div className="relative aspect-[5/4] overflow-hidden rounded-[1rem] bg-[linear-gradient(180deg,#f3efe6_0%,#e7e1d6_100%)]">
                      <Image
                        src={IMAGE_SRC}
                        alt="Afiche del conversatorio 'Desprotección y sufrimiento de la infancia en Chile' con Juan Carlos Rauld"
                        fill
                        priority
                        sizes="(min-width: 1024px) 264px, 58vw"
                        className="object-contain object-center"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-700 sm:text-xs">
                    Transmisión en vivo · inscripción previa
                  </p>
                  <h2 className="mt-2.5 max-w-sm text-[1.5rem] font-semibold leading-[1.08] tracking-[-0.03em] text-slate-950 sm:text-[1.75rem] lg:text-[1.9rem]">
                    Desprotección y sufrimiento de la infancia en Chile.
                  </h2>
                  <p className="mt-3 max-w-md text-[14px] leading-6 text-slate-700">
                    Conversatorio con <span className="font-semibold text-slate-950">Juan Carlos Rauld</span>, Director del Centro de Reflexiones Críticas (CRC).
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                <MetaItem icon={CalendarDays} label="Fecha" value="Martes 30 de junio" />
                <MetaItem icon={Clock3} label="Hora" value="20:30 hrs. (Chile)" />
                <MetaItem icon={Radio} label="Formato" value="Streaming en vivo" />
              </div>

              <p className="mt-3 text-[12px] leading-5 text-slate-600">
                Te enviaremos el enlace de la transmisión a tu correo antes del evento.{" "}
                <Link href="/eventos/desproteccion-infancia" className="font-semibold text-slate-900 underline">
                  Ver página del evento
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="bg-slate-950 px-4 py-4 text-white sm:px-5 sm:py-5">
            <div className="rounded-[1.35rem] border border-white/10 bg-white/6 p-3.5 shadow-[0_24px_70px_-38px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:p-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                <Radio className="h-3.5 w-3.5 text-cyan-300" />
                Inscripción web
              </div>

              <h3 className="mt-3.5 text-[1.45rem] font-semibold tracking-[-0.03em] text-white sm:text-[1.6rem]">
                Reserva tu cupo
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-300">
                Completa tus datos para participar y recibir el link de acceso.
              </p>

              <div className="mt-3.5">
                <DesproteccionRegistrationForm variant="dark" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.1rem] border border-black/8 bg-white/62 p-3 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)]">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        <Icon className="h-3.5 w-3.5 text-slate-700" />
        {label}
      </div>
      <p className="mt-1 text-sm font-semibold leading-6 text-slate-900">{value}</p>
    </div>
  );
}
