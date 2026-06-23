"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { DesproteccionRegistrationForm } from "@/components/DesproteccionRegistrationForm";
import { CountdownStrip, LiveCountBadge, LiveStreamBadge } from "@/components/DesproteccionEventMeta";

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
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-slate-950/78 p-3 backdrop-blur-md sm:p-4">
      <div className="absolute inset-0" onClick={close} aria-hidden="true" />

      <section className="relative z-10 mx-auto my-0 w-full max-w-[920px] overflow-hidden rounded-[1.5rem] border border-white/12 bg-slate-950 shadow-[0_40px_120px_-35px_rgba(15,23,42,0.7)] sm:my-4">
        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white shadow-sm backdrop-blur-sm transition hover:bg-black/65"
          aria-label="Cerrar invitación"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
          {/* Flyer a sangre — la pieza ya trae título, foto, fecha y hora */}
          <div className="relative aspect-[16/13] lg:aspect-auto lg:min-h-[560px]">
            <Image
              src={IMAGE_SRC}
              alt="Afiche del conversatorio 'Desprotección y sufrimiento de la infancia en Chile' con Juan Carlos Rauld, martes 30 de junio, 20:30 hrs."
              fill
              priority
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover object-[60%_center]"
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/65 to-transparent" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2 lg:left-5 lg:top-5">
              <LiveStreamBadge />
              <LiveCountBadge />
            </div>
            <Link
              href="/eventos/desproteccion-infancia"
              className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white underline-offset-4 hover:underline lg:bottom-5 lg:left-5"
            >
              Ver página del evento
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Inscripción */}
          <div className="flex flex-col justify-center bg-slate-950 px-5 py-6 text-white sm:px-7 sm:py-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">Inscripción gratuita</p>
            <h3 className="mt-2 text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[1.75rem]">
              Reserva tu cupo para el conversatorio
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-slate-300">
              Te enviamos el link de acceso a tu correo antes del evento. Cupos de inscripción limitados.
            </p>

            <div className="mt-4">
              <CountdownStrip />
            </div>

            <div className="mt-5">
              <DesproteccionRegistrationForm variant="dark" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
