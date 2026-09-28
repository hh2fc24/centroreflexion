"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { getAttribution } from "@/lib/attribution";

export const SEMINARIO_SOURCE = "seminario-desproteccion-infancia";
export const SEMINARIO_FORM_ID = "seminario-desproteccion-postulacion";

type SubmissionState = "idle" | "submitting" | "success" | "error";

function createSubmissionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `post-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const POBLACIONES = [
  "Programas de protección (PIE, PRM, PPF, DAM)",
  "Residencias / cuidado alternativo",
  "OPD u oficinas municipales de niñez",
  "Educación (escuela, dupla psicosocial, convivencia)",
  "Salud / salud mental",
  "Justicia, defensoría o fiscalía",
  "Academia, docencia o investigación",
  "Otro",
];

export function SeminarioPostulacionForm({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const pathname = usePathname();
  const [state, setState] = useState<SubmissionState>("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const dark = variant === "dark";

  if (state === "success") {
    return (
      <div
        className={
          dark
            ? "rounded-[6px] border border-[#e4935d]/50 px-6 py-7"
            : "rounded-[6px] border border-[#bd6f3c] bg-[#fffdf8] px-6 py-7"
        }
        role="status"
      >
        <p className={`text-[0.8125rem] font-semibold ${dark ? "text-[#e4935d]" : "text-[#9f5528]"}`}>
          Postulación recibida
        </p>
        <p
          className={`crc-serif mt-2 text-[1.35rem] font-medium leading-[1.25] ${
            dark ? "text-[#fbf7ee]" : "text-[#171713]"
          }`}
        >
          Gracias. Ya la tenemos.
        </p>
        <p className={`mt-3 text-[0.9375rem] leading-[1.7] ${dark ? "text-[#ede7dc]/80" : "text-[#55574f]"}`}>
          Te vamos a escribir dentro de las próximas 24 horas hábiles para coordinar una conversación breve de 15
          minutos y confirmar tu cupo. Revisa también tu carpeta de spam.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
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
            source: SEMINARIO_SOURCE,
            formId: SEMINARIO_FORM_ID,
            page: pathname || "/seminarios/desproteccion-infancia",
            name: String(form.get("name") ?? ""),
            email: String(form.get("email") ?? ""),
            phone: String(form.get("phone") ?? ""),
            message: String(form.get("motivacion") ?? ""),
            fields: {
              programa: "Seminario Desprotección de la Infancia — Cohorte 1 (oct–dic 2026)",
              institucion: String(form.get("institucion") ?? ""),
              poblacion: String(form.get("poblacion") ?? ""),
              convenioInstitucional: form.get("convenio") ? "sí" : "no",
            },
            // Primer y último contacto (qué cuenta o canal trajo a la persona).
            attribution: getAttribution(),
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

          if (response.ok && (!json || json.ok !== false)) {
            setState("success");
            formElement.reset();
            return;
          }

          setState("error");
          setErrorText(
            json?.error === "rate_limited"
              ? "Estamos recibiendo varios envíos. Espera unos segundos y vuelve a intentar."
              : "No pudimos registrar tu postulación. Revisa tus datos y vuelve a intentar."
          );
        } catch {
          setState("error");
          setErrorText("No pudimos enviar tu postulación. Revisa tu conexión y vuelve a intentar.");
        }
      }}
    >
      <Field id="sem-name" label="Nombre completo" name="name" type="text" placeholder="Tu nombre" dark={dark} />
      <Field id="sem-email" label="Correo electrónico" name="email" type="email" placeholder="nombre@correo.cl" dark={dark} />
      <Field id="sem-phone" label="WhatsApp" name="phone" type="tel" placeholder="+56 9 1234 5678" dark={dark} />
      <Field
        id="sem-institucion"
        label="Dónde trabajas"
        name="institucion"
        type="text"
        placeholder="Institución, programa o municipio"
        dark={dark}
      />

      <div>
        <label htmlFor="sem-poblacion" className={labelClass(dark)}>
          Con qué población trabajas
        </label>
        <select id="sem-poblacion" name="poblacion" required className={inputClass(dark)} defaultValue="">
          <option value="" disabled>
            Selecciona una opción
          </option>
          {POBLACIONES.map((p) => (
            <option key={p} value={p} className="text-[#171713]">
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sem-motivacion" className={labelClass(dark)}>
          Por qué te interesa el seminario
        </label>
        <textarea
          id="sem-motivacion"
          name="motivacion"
          rows={3}
          required
          placeholder="Un par de líneas bastan."
          className={`${inputClass(dark)} h-auto py-3 leading-[1.6]`}
        />
      </div>

      <label
        className={`flex cursor-pointer items-start gap-3 text-[0.9375rem] leading-[1.55] ${
          dark ? "text-[#ede7dc]/80" : "text-[#55574f]"
        }`}
      >
        <input
          type="checkbox"
          name="convenio"
          className="mt-1 h-4 w-4 shrink-0 accent-[#bd6f3c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bd6f3c]"
        />
        <span>Postulo junto a más personas de mi institución (3 o más, 15% de descuento c/u).</span>
      </label>

      {state === "error" && errorText ? (
        <div
          role="alert"
          className={`flex items-start gap-3 rounded-[6px] border px-4 py-3 text-[0.9375rem] leading-[1.55] ${
            dark
              ? "border-[#e4935d] text-[#fbf7ee]"
              : "border-[#9f5528] bg-[#fffdf8] text-[#171713]"
          }`}
        >
          <AlertCircle
            aria-hidden="true"
            className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-[#e4935d]" : "text-[#9f5528]"}`}
          />
          <span>
            <span className="font-semibold">No se envió la postulación.</span> {errorText}
          </span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex h-12 w-full items-center justify-center rounded-[6px] bg-[#bd6f3c] px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bd6f3c] disabled:cursor-wait disabled:opacity-60"
      >
        {state === "submitting" ? "Enviando postulación…" : "Postular al seminario"}
      </button>

      <p className={`text-[0.875rem] leading-[1.6] ${dark ? "text-[#ede7dc]/70" : "text-[#6f675d]"}`}>
        Postular no compromete pago. Revisamos cada postulación y te contactamos para confirmar el cupo.
      </p>
    </form>
  );
}

// Etiquetas en tipo oración sobre el campo; borde de la paleta y foco cobre
// visible. `user-invalid` marca el campo solo después de que la persona lo tocó.
function labelClass(dark: boolean) {
  return `mb-1.5 block text-[0.875rem] font-semibold ${dark ? "text-[#fbf7ee]" : "text-[#171713]"}`;
}

function inputClass(dark: boolean) {
  const base =
    "block h-12 w-full rounded-[6px] border px-3.5 text-[1rem] outline-none transition-colors focus:border-[#bd6f3c] focus:ring-1 focus:ring-[#bd6f3c] user-invalid:border-[#9f5528]";
  return dark
    ? `${base} border-[#f1ede4]/25 bg-transparent text-[#fbf7ee] placeholder:text-[#ede7dc]/45`
    : `${base} border-[#ded5c7] bg-[#fffdf8] text-[#171713] placeholder:text-[#6f675d]/70`;
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
      <label htmlFor={id} className={labelClass(dark)}>
        {label}
      </label>
      <input id={id} name={name} type={type} required placeholder={placeholder} className={inputClass(dark)} />
    </div>
  );
}
