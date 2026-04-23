"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CalendarDays, Clock3, Gift, MapPin, Ticket, X } from "lucide-react";

const IMAGE_SRC = "/images/tecnocratas-evento-uah.jpeg";
const DISMISS_KEY = "crc.evento.tecnocratas.dismissed.session";
const REGISTERED_KEY = "crc.evento.tecnocratas.registered";

export function LaunchEventModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    if (typeof window === "undefined") return;

    const dismissed = window.sessionStorage.getItem(DISMISS_KEY) === "1";
    const registered = window.localStorage.getItem(REGISTERED_KEY) === "1";
    if (dismissed || registered) return;

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

  const eventMeta = useMemo(
    () => [
      {
        icon: CalendarDays,
        label: "Fecha",
        value: "Miércoles 29 de abril",
      },
      {
        icon: Clock3,
        label: "Hora",
        value: "18:30 hrs.",
      },
      {
        icon: MapPin,
        label: "Lugar",
        value: "Sala A-27, Alameda 1825 · Metro Los Héroes",
      },
    ],
    []
  );

  if (!open || isAdmin) return null;

  const close = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    }
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-slate-950/72 p-4 backdrop-blur-md sm:p-6">
      <div
        className="absolute inset-0"
        onClick={close}
        aria-hidden="true"
      />

      <section className="relative z-10 mx-auto my-0 w-full max-w-[960px] rounded-[1.75rem] border border-white/12 bg-[linear-gradient(135deg,#f7f4ee_0%,#f1ede5_48%,#e7e2d8_100%)] text-slate-950 shadow-[0_40px_120px_-35px_rgba(15,23,42,0.55)] sm:my-6">
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/72 text-slate-700 shadow-sm transition hover:bg-white"
          aria-label="Cerrar invitación"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_332px]">
          <div className="relative overflow-hidden border-b border-black/6 p-5 sm:p-6 lg:border-b-0 lg:border-r lg:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,28,28,0.1),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_28%)]" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-red-700 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
                  Lanzamiento de libro
                </span>
                <span className="inline-flex items-center rounded-full border border-black/10 bg-white/72 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  Facultad de Ciencias Sociales UAH
                </span>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[292px_minmax(0,1fr)] lg:items-center">
                <div className="mx-auto w-full max-w-[292px]">
                  <div className="overflow-hidden rounded-[1.55rem] border border-black/8 bg-white/78 p-3 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.38)]">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-[linear-gradient(180deg,#f3efe6_0%,#e7e1d6_100%)]">
                      <Image
                        src={IMAGE_SRC}
                        alt="Afiche del lanzamiento del libro Tecnócratas de la infancia en la Universidad Alberto Hurtado"
                        fill
                        priority
                        sizes="(min-width: 1024px) 292px, 62vw"
                        className="object-contain object-center"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-700 sm:text-xs">
                    Encuentro presencial con inscripción previa
                  </p>
                  <h2 className="mt-3 max-w-md text-[1.95rem] font-semibold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-[2.35rem] lg:text-[2.7rem]">
                    Inscríbete al lanzamiento del libro.
                  </h2>
                  <p className="mt-3 max-w-md text-[15px] leading-7 text-slate-700">
                    Reserva tu asistencia para la presentación de <span className="font-semibold text-slate-950">Tecnócratas de la infancia</span> en la Universidad Alberto Hurtado.
                  </p>

                  <div className="mt-4 rounded-[1.35rem] border border-black/8 bg-white/62 p-4 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.35)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Participan
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-800">
                      Juan Carlos Rauld, Alejandro Castro, Francis Valverde y Katia García.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {eventMeta.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-black/8 bg-white/62 p-3.5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)]">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        <Icon className="h-3.5 w-3.5 text-red-700" />
                        {item.label}
                      </div>
                      <p className="mt-1.5 text-sm font-semibold leading-6 text-slate-900">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-slate-950 px-5 py-5 text-white sm:px-6 sm:py-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 shadow-[0_24px_70px_-38px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:p-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                <Ticket className="h-3.5 w-3.5 text-cyan-300" />
                Inscripción web
              </div>

              <h3 className="mt-4 text-[1.7rem] font-semibold tracking-[-0.03em] text-white sm:text-[1.85rem]">
                Reserva tu asistencia
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Completa tus datos para incorporarte al listado de inscritos de esta actividad.
              </p>

              <form
                className="mt-4 space-y-3.5"
                onSubmit={async (event) => {
                  event.preventDefault();
                  setBusy(true);
                  setError(null);
                  setSubmitted(false);

                  try {
                    const form = new FormData(event.currentTarget);
                    const payload = {
                      source: "evento-tecnocratas-uah",
                      formId: "launch-event-modal",
                      page: pathname || "/",
                      name: String(form.get("name") ?? ""),
                      email: String(form.get("email") ?? ""),
                      phone: String(form.get("phone") ?? ""),
                      message:
                        "Inscripción web al lanzamiento de 'Tecnócratas de la infancia' en la UAH. Participa en sorteo de libro para asistentes inscritos.",
                      fields: {
                        event: "Tecnócratas de la infancia · UAH · 29 abril 2026",
                        attendanceMode: "presencial",
                      },
                    };

                    const response = await fetch("/api/leads", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    const json = (await response.json()) as { ok?: boolean; error?: string };

                    if (!json.ok) {
                      setSubmitted(false);
                      setError("No pudimos registrar tu inscripción. Intenta nuevamente.");
                      return;
                    }

                    if (typeof window !== "undefined") {
                      window.localStorage.setItem(REGISTERED_KEY, "1");
                      window.sessionStorage.setItem(DISMISS_KEY, "1");
                    }

                    setError(null);
                    setSubmitted(true);
                    (event.currentTarget as HTMLFormElement).reset();
                  } catch {
                    setSubmitted(false);
                    setError("No pudimos registrar tu inscripción. Intenta nuevamente.");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <Field
                  id="launch-name"
                  label="Nombre"
                  name="name"
                  type="text"
                  placeholder="Tu nombre completo"
                />
                <Field
                  id="launch-email"
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="nombre@correo.cl"
                />
                <Field
                  id="launch-phone"
                  label="Número telefónico"
                  name="phone"
                  type="tel"
                  placeholder="+56 9 1234 5678"
                />

                {error ? (
                  <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                    {error}
                  </div>
                ) : null}

                {submitted ? (
                  <div className="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-500/10 px-4 py-4 text-sm leading-6 text-emerald-100">
                    Tu inscripción fue registrada correctamente. Te esperamos en el lanzamiento.
                  </div>
                ) : (
                  <Button
                    type="submit"
                    disabled={busy}
                    className="h-11 w-full rounded-full border-0 bg-cyan-400 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                  >
                    {busy ? "Registrando inscripción…" : "Inscribirme para asistir"}
                  </Button>
                )}

                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3.5 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <Gift className="mt-0.5 h-5 w-5 text-amber-300" />
                    <div>
                      <p className="text-sm font-semibold text-white">Sorteo para asistentes inscritos</p>
                      <p className="mt-1 text-sm leading-6 text-slate-300">
                        Entre las personas inscritas vía web que asistan al evento, se sorteará un ejemplar del libro.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  id,
  label,
  name,
  type,
  placeholder,
}: {
  id: string;
  label: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-white/90">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="block h-11 w-full rounded-2xl border border-white/10 bg-white/7 px-4 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-cyan-300/60 focus:bg-white/10"
      />
    </div>
  );
}
