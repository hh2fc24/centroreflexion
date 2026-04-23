"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CalendarDays, Clock3, Gift, MapPin, Sparkles, Ticket, X } from "lucide-react";

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
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/72 p-4 backdrop-blur-md sm:p-6">
      <div
        className="absolute inset-0"
        onClick={close}
        aria-hidden="true"
      />

      <section className="relative z-10 flex max-h-[88vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-[1.75rem] border border-white/12 bg-[linear-gradient(135deg,#f6f3eb_0%,#f1eee6_42%,#e8e5dc_100%)] text-slate-950 shadow-[0_40px_120px_-35px_rgba(15,23,42,0.55)]">
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/72 text-slate-700 shadow-sm transition hover:bg-white"
          aria-label="Cerrar invitación"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="relative min-h-[300px] overflow-hidden border-b border-black/6 p-5 sm:p-6 lg:border-b-0 lg:border-r lg:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,28,28,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_30%)]" />

            <div className="relative flex h-full flex-col">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-700 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
                      <Sparkles className="h-3.5 w-3.5" />
                      Apertura de sitio
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                      Facultad de Ciencias Sociales UAH
                    </span>
                  </div>

                  <div className="mt-5 max-w-2xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-red-700 sm:text-xs">
                      Lanzamiento de libro
                    </p>
                    <h2 className="mt-3 max-w-3xl text-[2.45rem] font-bold leading-[0.98] tracking-tight text-slate-950 sm:text-5xl lg:text-[4rem] font-serif">
                      Tecnócratas de la infancia:
                      <span className="block pt-2">Desprotección y neoliberalismo en Chile</span>
                    </h2>
                    <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-700 sm:text-base">
                      Inscríbete para asistir al lanzamiento y recibir la información del encuentro. Entre quienes se registren
                      vía web y asistan presencialmente, se sorteará un ejemplar del libro.
                    </p>
                  </div>
                </div>

                <div className="mx-auto w-full max-w-[280px]">
                  <div className="overflow-hidden rounded-[1.5rem] border border-black/8 bg-white/70 p-3 shadow-[0_20px_60px_-34px_rgba(15,23,42,0.35)]">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-[#ece7dc]">
                      <Image
                        src={IMAGE_SRC}
                        alt="Afiche del lanzamiento del libro Tecnócratas de la infancia en la Universidad Alberto Hurtado"
                        fill
                        priority
                        sizes="(min-width: 1024px) 280px, 60vw"
                        className="object-contain object-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {eventMeta.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-black/8 bg-white/62 p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)]">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        <Icon className="h-3.5 w-3.5 text-red-700" />
                        {item.label}
                      </div>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{item.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-black/8 bg-white/58 px-4 py-4 text-sm leading-6 text-slate-700 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.35)]">
                Presentan Juan Carlos Rauld y Alejandro Castro. Comentan Francis Valverde y Katia García.
              </div>
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto bg-slate-950 px-5 py-5 text-white sm:px-6 sm:py-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5 shadow-[0_24px_70px_-38px_rgba(0,0,0,0.55)] backdrop-blur-sm">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                <Ticket className="h-3.5 w-3.5 text-cyan-300" />
                Inscripción web
              </div>

              <h3 className="mt-4 text-[2rem] font-bold tracking-tight text-white font-serif">
                Reserva tu asistencia
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Déjanos tus datos y te consideraremos en el listado de inscritos para esta actividad.
              </p>

              <form
                className="mt-5 space-y-4"
                onSubmit={async (event) => {
                  event.preventDefault();
                  setBusy(true);
                  setError(null);

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
                      setError("No pudimos registrar tu inscripción. Intenta nuevamente.");
                      return;
                    }

                    if (typeof window !== "undefined") {
                      window.localStorage.setItem(REGISTERED_KEY, "1");
                      window.sessionStorage.setItem(DISMISS_KEY, "1");
                    }

                    setSubmitted(true);
                    (event.currentTarget as HTMLFormElement).reset();
                  } catch {
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
                    className="h-12 w-full rounded-full border-0 bg-cyan-400 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                  >
                    {busy ? "Registrando inscripción…" : "Inscribirme para asistir"}
                  </Button>
                )}
              </form>
            </div>

            <footer className="mt-4 rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Gift className="mt-0.5 h-5 w-5 text-amber-300" />
                <div>
                  <p className="text-sm font-semibold text-white">Sorteo para asistentes inscritos</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Entre las personas inscritas vía web que asistan al evento, se sorteará un ejemplar del libro.
                  </p>
                </div>
              </div>
            </footer>
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
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-white/90">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="block h-12 w-full rounded-2xl border border-white/10 bg-white/7 px-4 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-cyan-300/60 focus:bg-white/10"
      />
    </div>
  );
}
