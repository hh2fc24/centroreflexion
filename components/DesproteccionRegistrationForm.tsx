"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

const EVENT_SOURCE = "evento-desproteccion-infancia";
const EVENT_FORM_ID = "desproteccion-infancia-modal";
export const DESPROTECCION_REGISTERED_KEY = "crc.evento.desproteccion.registered";

type SubmissionState = "idle" | "submitting" | "success" | "error";

function createSubmissionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function markRegistered() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DESPROTECCION_REGISTERED_KEY, "1");
  } catch {
    // Registration should stay successful even if storage is unavailable.
  }
}

export function DesproteccionRegistrationForm({
  variant = "dark",
  onRegistered,
  className = "",
}: {
  variant?: "dark" | "light";
  onRegistered?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const [state, setState] = useState<SubmissionState>("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const dark = variant === "dark";

  return (
    <form
      className={`space-y-3 ${className}`}
      onSubmit={async (event) => {
        event.preventDefault();
        if (state === "submitting") return;

        setState("submitting");
        setErrorText(null);

        try {
          const formElement = event.currentTarget;
          const form = new FormData(formElement);
          const payload = {
            id: createSubmissionId(),
            source: EVENT_SOURCE,
            formId: EVENT_FORM_ID,
            page: pathname || "/",
            name: String(form.get("name") ?? ""),
            email: String(form.get("email") ?? ""),
            phone: String(form.get("phone") ?? ""),
            message:
              "Inscripción web al conversatorio 'Desprotección y sufrimiento de la infancia en Chile' con Juan Carlos Rauld.",
            fields: {
              event: "Desprotección y sufrimiento de la infancia en Chile",
              speaker: "Juan Carlos Rauld",
              date: "Martes 30 de junio, 20:30 hrs. (Chile)",
              attendanceMode: "streaming",
            },
          };

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
            setState("success");
            markRegistered();
            formElement.reset();
            onRegistered?.();
            return;
          }

          setState("error");
          setErrorText(
            json?.error === "rate_limited"
              ? "Estamos recibiendo varios envíos. Espera unos segundos y vuelve a intentar."
              : "Revisa tus datos de contacto y vuelve a intentar."
          );
        } catch {
          setState("error");
          setErrorText("No pudimos enviar tu inscripción. Revisa tu conexión y vuelve a intentar.");
        }
      }}
    >
      <Field id="desproteccion-name" label="Nombre" name="name" type="text" placeholder="Tu nombre completo" dark={dark} />
      <Field id="desproteccion-email" label="Email" name="email" type="email" placeholder="nombre@correo.cl" dark={dark} />
      <Field id="desproteccion-phone" label="Número telefónico" name="phone" type="tel" placeholder="+56 9 1234 5678" dark={dark} />

      {state === "error" && errorText ? (
        <div
          className={
            dark
              ? "rounded-[1.15rem] border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100"
              : "rounded-[1.15rem] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
          }
        >
          {errorText}
        </div>
      ) : null}

      {state === "success" ? (
        <div
          className={
            dark
              ? "rounded-[1.2rem] border border-emerald-400/20 bg-emerald-500/10 px-4 py-3.5 text-sm leading-6 text-emerald-100"
              : "rounded-[1.2rem] border border-emerald-300 bg-emerald-50 px-4 py-3.5 text-sm leading-6 text-emerald-800"
          }
        >
          Tu inscripción fue registrada correctamente. Te enviaremos el link de acceso al streaming antes del evento.
        </div>
      ) : (
        <Button
          type="submit"
          disabled={state === "submitting"}
          className={
            dark
              ? "h-10 w-full rounded-full border-0 bg-cyan-400 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
              : "h-10 w-full rounded-full border-0 bg-red-700 text-sm font-semibold text-white hover:bg-red-800"
          }
        >
          {state === "submitting" ? "Registrando inscripción…" : "Inscribirme para participar"}
        </Button>
      )}
    </form>
  );
}

function Field({
  id,
  label,
  name,
  type,
  placeholder,
  dark,
}: {
  id: string;
  label: string;
  name: string;
  type: string;
  placeholder: string;
  dark: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`mb-1.5 block text-sm font-semibold ${dark ? "text-white/90" : "text-slate-800"}`}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className={
          dark
            ? "block h-10 w-full rounded-2xl border border-white/10 bg-white/7 px-4 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-cyan-300/60 focus:bg-white/10"
            : "block h-10 w-full rounded-2xl border border-black/12 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-red-700/50"
        }
      />
    </div>
  );
}
