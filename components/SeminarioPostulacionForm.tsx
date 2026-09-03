"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

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
            ? "rounded-[5px] border border-[#bd6f3c]/40 bg-[#bd6f3c]/10 px-6 py-7"
            : "rounded-[5px] border border-[#bd6f3c]/40 bg-[#bd6f3c]/8 px-6 py-7"
        }
      >
        <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-[#bd6f3c]">
          Postulación recibida
        </p>
        <p
          className={`crc-serif mt-3 text-[1.35rem] font-medium leading-[1.25] ${
            dark ? "text-[#fbf7ee]" : "text-[#171713]"
          }`}
        >
          Gracias. Ya la tenemos.
        </p>
        <p className={`mt-3 text-[0.88rem] leading-[1.75] ${dark ? "text-[#ede7dc]/75" : "text-[#55574f]"}`}>
          Te vamos a escribir dentro de las próximas 24 horas hábiles para coordinar una conversación breve de 15
          minutos y confirmar tu cupo. Revisa también tu carpeta de spam.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
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
      <Field id="sem-email" label="Email" name="email" type="email" placeholder="nombre@correo.cl" dark={dark} />
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
            <option key={p} value={p} className="text-slate-900">
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
          className={`${inputClass(dark)} h-auto py-3 leading-[1.65]`}
        />
      </div>

      <label
        className={`flex items-start gap-2.5 text-[0.78rem] leading-[1.6] ${
          dark ? "text-[#ede7dc]/70" : "text-[#55574f]"
        }`}
      >
        <input
          type="checkbox"
          name="convenio"
          className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-[2px] accent-[#bd6f3c]"
        />
        <span>Postulo junto a más personas de mi institución (3 o más, 15% de descuento c/u).</span>
      </label>

      {state === "error" && errorText ? (
        <div
          className={
            dark
              ? "rounded-[4px] border border-[#c0553d]/40 bg-[#c0553d]/12 px-4 py-3 text-[0.82rem] leading-[1.6] text-[#f0c9bd]"
              : "rounded-[4px] border border-[#c0553d]/35 bg-[#c0553d]/8 px-4 py-3 text-[0.82rem] leading-[1.6] text-[#9f3a24]"
          }
        >
          {errorText}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-[5px] bg-[#bd6f3c] text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-white transition duration-200 hover:bg-[#a85f31] disabled:opacity-55"
      >
        {state === "submitting" ? "Enviando postulación…" : "Postular al seminario"}
      </button>

      <p className={`text-[0.72rem] leading-[1.6] ${dark ? "text-[#ede7dc]/50" : "text-[#8a8276]"}`}>
        Postular no compromete pago. Revisamos cada postulación y te contactamos para confirmar el cupo.
      </p>
    </form>
  );
}

// Versalitas para las etiquetas y campos de esquina casi recta: es la misma
// familia de formas que usan los botones y las tarjetas del resto del sitio.
function labelClass(dark: boolean) {
  return `mb-2 block text-[0.6rem] font-extrabold uppercase tracking-[0.18em] ${
    dark ? "text-[#bd6f3c]" : "text-[#bd6f3c]"
  }`;
}

function inputClass(dark: boolean) {
  return dark
    ? "block h-11 w-full rounded-[4px] border border-[#f1ede4]/18 bg-[#f1ede4]/[0.05] px-3.5 text-[0.88rem] text-[#fbf7ee] outline-none transition placeholder:text-[#ede7dc]/35 focus:border-[#bd6f3c] focus:bg-[#f1ede4]/[0.08]"
    : "block h-11 w-full rounded-[4px] border border-[rgba(101,91,74,0.28)] bg-[#fffdf8] px-3.5 text-[0.88rem] text-[#171713] outline-none transition placeholder:text-[#a9a294] focus:border-[#bd6f3c]";
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
