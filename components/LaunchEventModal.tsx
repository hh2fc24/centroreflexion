"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CalendarDays, Clock3, Gift, MapPin, RefreshCw, Ticket, X } from "lucide-react";

const IMAGE_SRC = "/images/tecnocratas-evento-uah.jpeg";
const DISMISS_KEY = "crc.evento.tecnocratas.dismissed.session";
const REGISTERED_KEY = "crc.evento.tecnocratas.registered";
const PENDING_KEY = "crc.evento.tecnocratas.pending";

type SubmissionState = "idle" | "submitting" | "confirming" | "success" | "unconfirmed" | "error";
type FeedbackTone = "info" | "neutral" | "error";

type Feedback = {
  tone: FeedbackTone;
  text: string;
};

type PendingRegistration = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: number;
  page: string;
};

function createSubmissionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readPendingRegistration(): PendingRegistration | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PendingRegistration>;
    if (!parsed?.id) return null;

    return {
      id: String(parsed.id),
      name: String(parsed.name || ""),
      email: String(parsed.email || ""),
      phone: String(parsed.phone || ""),
      createdAt: typeof parsed.createdAt === "number" ? parsed.createdAt : Date.now(),
      page: String(parsed.page || "/"),
    };
  } catch {
    return null;
  }
}

function writePendingRegistration(value: PendingRegistration | null) {
  if (typeof window === "undefined") return;

  try {
    if (!value) {
      window.sessionStorage.removeItem(PENDING_KEY);
      return;
    }

    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(value));
  } catch {
    // Ignore storage failures; the network confirmation flow still works without persistence.
  }
}

function markRegistered() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(REGISTERED_KEY, "1");
    window.sessionStorage.setItem(DISMISS_KEY, "1");
    window.sessionStorage.removeItem(PENDING_KEY);
  } catch {
    // Registration should stay successful even if storage is unavailable.
  }
}

function pause(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function LaunchEventModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null);
  const resumedSubmissionIdRef = useRef<string | null>(null);

  const isAdmin = pathname.startsWith("/admin");
  const busy = submissionState === "submitting" || submissionState === "confirming";

  useEffect(() => {
    if (isAdmin) return;
    if (typeof window === "undefined") return;

    const dismissed = window.sessionStorage.getItem(DISMISS_KEY) === "1";
    const registered = window.localStorage.getItem(REGISTERED_KEY) === "1";
    const pending = readPendingRegistration();
    if (registered) return;

    if (pending?.id) {
      const timer = window.setTimeout(() => setOpen(true), 0);
      return () => window.clearTimeout(timer);
    }

    if (dismissed) return;

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

  const markSuccess = useCallback((form?: HTMLFormElement | null) => {
    setFeedback(null);
    setSubmissionState("success");
    setActiveSubmissionId(null);
    resumedSubmissionIdRef.current = null;
    writePendingRegistration(null);
    markRegistered();
    form?.reset();
  }, []);

  const confirmRegistration = useCallback(
    async (submissionId: string, form?: HTMLFormElement | null) => {
      setActiveSubmissionId(submissionId);
      setSubmissionState("confirming");
      setFeedback({
        tone: "info",
        text: "Estamos confirmando tu inscripción con la base del evento.",
      });

      let verificationUnavailable = false;

      for (let attempt = 0; attempt < 4; attempt += 1) {
        try {
          const response = await fetch(`/api/evento/inscritos?id=${encodeURIComponent(submissionId)}&ts=${Date.now()}`, {
            cache: "no-store",
          });
          const raw = await response.text();
          let json: { ok?: boolean; found?: boolean } | null = null;

          try {
            json = JSON.parse(raw) as { ok?: boolean; found?: boolean };
          } catch {
            json = null;
          }

          if (response.ok && json?.ok && json.found) {
            markSuccess(form);
            return true;
          }

          if (!response.ok || json?.ok === false) {
            verificationUnavailable = true;
          }
        } catch {
          verificationUnavailable = true;
        }

        if (attempt < 3) {
          await pause(800 + attempt * 700);
        }
      }

      setSubmissionState("unconfirmed");
      setFeedback({
        tone: "neutral",
        text: verificationUnavailable
          ? "Tu solicitud ya fue enviada. La base aún no respondió la verificación visual, así que evita reenviarla y vuelve a comprobar en unos segundos."
          : "Tu solicitud ya fue enviada. Estamos esperando la confirmación final del registro.",
      });

      return false;
    },
    [markSuccess]
  );

  useEffect(() => {
    if (!open || isAdmin || submissionState === "success") return;

    const pending = readPendingRegistration();
    if (!pending?.id) return;
    if (resumedSubmissionIdRef.current === pending.id) return;

    const timer = window.setTimeout(() => {
      resumedSubmissionIdRef.current = pending.id;
      void confirmRegistration(pending.id);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [confirmRegistration, isAdmin, open, submissionState]);

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
      <div
        className="absolute inset-0"
        onClick={close}
        aria-hidden="true"
      />

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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,28,28,0.1),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_28%)]" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-red-700 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
                  Lanzamiento de libro
                </span>
                <span className="inline-flex items-center rounded-full border border-black/10 bg-white/72 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  Facultad de Ciencias Sociales UAH
                </span>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[264px_minmax(0,1fr)] lg:items-center">
                <div className="mx-auto w-full max-w-[264px]">
                  <div className="overflow-hidden rounded-[1.4rem] border border-black/8 bg-white/78 p-2.5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.38)]">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-[linear-gradient(180deg,#f3efe6_0%,#e7e1d6_100%)]">
                      <Image
                        src={IMAGE_SRC}
                        alt="Afiche del lanzamiento del libro Tecnócratas de la infancia en la Universidad Alberto Hurtado"
                        fill
                        priority
                        sizes="(min-width: 1024px) 264px, 58vw"
                        className="object-contain object-center"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-700 sm:text-xs">
                    Encuentro presencial con inscripción previa
                  </p>
                  <h2 className="mt-2.5 max-w-sm text-[1.65rem] font-semibold leading-[1.04] tracking-[-0.04em] text-slate-950 sm:text-[1.95rem] lg:text-[2.1rem]">
                    Confirma tu lugar en el lanzamiento.
                  </h2>
                  <p className="mt-3 max-w-md text-[14px] leading-6 text-slate-700">
                    Inscríbete para asistir a la presentación de <span className="font-semibold text-slate-950">Tecnócratas de la infancia</span> en la Universidad Alberto Hurtado.
                  </p>

                  <div className="mt-3.5 rounded-[1.2rem] border border-black/8 bg-white/62 p-3.5 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.35)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Participan
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-slate-800">
                      Juan Carlos Rauld, Alejandro Castro, Francis Valverde y Katia García.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                {eventMeta.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-[1.1rem] border border-black/8 bg-white/62 p-3 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)]">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        <Icon className="h-3.5 w-3.5 text-red-700" />
                        {item.label}
                      </div>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-900">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-slate-950 px-4 py-4 text-white sm:px-5 sm:py-5">
            <div className="rounded-[1.35rem] border border-white/10 bg-white/6 p-3.5 shadow-[0_24px_70px_-38px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:p-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                <Ticket className="h-3.5 w-3.5 text-cyan-300" />
                Inscripción web
              </div>

              <h3 className="mt-3.5 text-[1.45rem] font-semibold tracking-[-0.03em] text-white sm:text-[1.6rem]">
                Reserva tu asistencia
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-300">
                Completa tus datos para quedar en el listado de asistentes de esta actividad.
              </p>

              <form
                className="mt-3.5 space-y-3"
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (busy) return;

                  setSubmissionState("submitting");
                  setFeedback(null);
                  let submissionId = "";

                  try {
                    const formElement = event.currentTarget as HTMLFormElement;
                    const form = new FormData(formElement);
                    submissionId = createSubmissionId();
                    const payload = {
                      id: submissionId,
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
                    const pendingRegistration: PendingRegistration = {
                      id: submissionId,
                      name: payload.name,
                      email: payload.email,
                      phone: payload.phone,
                      createdAt: Date.now(),
                      page: payload.page,
                    };

                    setActiveSubmissionId(submissionId);
                    writePendingRegistration(pendingRegistration);

                    const response = await fetch("/api/leads", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    const raw = await response.text();
                    let json: { ok?: boolean; error?: string } | null = null;

                    try {
                      json = JSON.parse(raw) as { ok?: boolean; error?: string };
                    } catch {
                      json = null;
                    }

                    const accepted = response.ok && (!json || json.ok !== false);
                    if (accepted) {
                      markSuccess(formElement);
                      return;
                    }

                    const hardError = json?.error === "missing_contact" || json?.error === "rate_limited";
                    if (hardError) {
                      writePendingRegistration(null);
                      setActiveSubmissionId(null);
                      resumedSubmissionIdRef.current = null;
                      setSubmissionState("error");
                      setFeedback({
                        tone: "error",
                        text:
                          json?.error === "rate_limited"
                            ? "Estamos recibiendo varios envíos. Espera unos segundos y vuelve a intentar."
                            : "Revisa tus datos de contacto y vuelve a intentar.",
                      });
                      return;
                    }

                    await confirmRegistration(submissionId, formElement);
                  } catch {
                    if (submissionId) {
                      await confirmRegistration(submissionId);
                    } else if (activeSubmissionId) {
                      await confirmRegistration(activeSubmissionId);
                    }
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

                {feedback ? <FeedbackNote tone={feedback.tone} text={feedback.text} /> : null}

                {submissionState === "success" ? (
                  <div className="rounded-[1.2rem] border border-emerald-400/20 bg-emerald-500/10 px-4 py-3.5 text-sm leading-6 text-emerald-100">
                    Tu inscripción fue registrada correctamente. Te esperamos en el lanzamiento.
                  </div>
                ) : submissionState === "unconfirmed" && activeSubmissionId ? (
                  <Button
                    type="button"
                    onClick={() => void confirmRegistration(activeSubmissionId)}
                    className="h-10 w-full rounded-full border border-white/12 bg-white/8 text-sm font-semibold text-white hover:bg-white/12"
                  >
                    Verificar nuevamente
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={busy}
                    className="h-10 w-full rounded-full border-0 bg-cyan-400 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                  >
                    {submissionState === "confirming" ? "Confirmando inscripción…" : busy ? "Registrando inscripción…" : "Inscribirme para asistir"}
                  </Button>
                )}

                <div className="rounded-[1.15rem] border border-white/10 bg-white/5 px-3.5 py-3 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <Gift className="mt-0.5 h-4 w-4 text-amber-300" />
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
        className="block h-10 w-full rounded-2xl border border-white/10 bg-white/7 px-4 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-cyan-300/60 focus:bg-white/10"
      />
    </div>
  );
}

function FeedbackNote({
  tone,
  text,
}: {
  tone: FeedbackTone;
  text: string;
}) {
  if (tone === "error") {
    return (
      <div className="rounded-[1.15rem] border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
        {text}
      </div>
    );
  }

  if (tone === "info") {
    return (
      <div className="flex items-start gap-3 rounded-[1.15rem] border border-cyan-300/18 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-50">
        <RefreshCw className="mt-0.5 h-4 w-4 animate-spin text-cyan-200" />
        <span>{text}</span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-[1.15rem] border border-white/12 bg-white/7 px-4 py-3 text-sm text-slate-200">
      <Clock3 className="mt-0.5 h-4 w-4 text-cyan-200" />
      <span>{text}</span>
    </div>
  );
}
