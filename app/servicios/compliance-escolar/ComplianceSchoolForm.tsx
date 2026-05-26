"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ComplianceSchoolForm() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  return (
    <form
      id="diagnostico-form"
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setResult(null);
        setBusy(true);

        try {
          const form = new FormData(e.currentTarget);
          const institution = String(form.get("institution") ?? "");
          const role = String(form.get("role") ?? "");
          const phone = String(form.get("phone") ?? "");
          const message = String(form.get("message") ?? "");

          const payload = {
            source: "compliance-escolar",
            name: String(form.get("name") ?? ""),
            email: String(form.get("email") ?? ""),
            phone,
            message: [
              `Institución/Colegio: ${institution}`,
              `Cargo: ${role}`,
              "",
              message,
            ].join("\n"),
            page: "/servicios/compliance-escolar",
            formId: "diagnostico-compliance-escolar",
            fields: { institution, role, phone },
          };

          const response = await fetch("/api/leads", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          });
          const json = (await response.json()) as { ok?: boolean; error?: string };

          if (!json.ok) {
            setResult(`Error: ${json.error}`);
            return;
          }

          setResult("Gracias. Recibimos la solicitud de diagnóstico institucional.");
          (e.currentTarget as HTMLFormElement).reset();
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
          setResult(`Error: ${message}`);
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold leading-6 text-[#171713]">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-2.5 block w-full rounded-md border-0 bg-white px-3.5 py-2 text-[#171713] shadow-sm ring-1 ring-inset ring-[#cfc4b4] placeholder:text-[#8a8276] focus:ring-2 focus:ring-inset focus:ring-[#bd6f3c] sm:text-sm sm:leading-6"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold leading-6 text-[#171713]">
            Email institucional
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-2.5 block w-full rounded-md border-0 bg-white px-3.5 py-2 text-[#171713] shadow-sm ring-1 ring-inset ring-[#cfc4b4] placeholder:text-[#8a8276] focus:ring-2 focus:ring-inset focus:ring-[#bd6f3c] sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="institution" className="block text-sm font-semibold leading-6 text-[#171713]">
            Institución/Colegio
          </label>
          <input
            type="text"
            id="institution"
            name="institution"
            required
            className="mt-2.5 block w-full rounded-md border-0 bg-white px-3.5 py-2 text-[#171713] shadow-sm ring-1 ring-inset ring-[#cfc4b4] placeholder:text-[#8a8276] focus:ring-2 focus:ring-inset focus:ring-[#bd6f3c] sm:text-sm sm:leading-6"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-semibold leading-6 text-[#171713]">
            Cargo
          </label>
          <input
            type="text"
            id="role"
            name="role"
            className="mt-2.5 block w-full rounded-md border-0 bg-white px-3.5 py-2 text-[#171713] shadow-sm ring-1 ring-inset ring-[#cfc4b4] placeholder:text-[#8a8276] focus:ring-2 focus:ring-inset focus:ring-[#bd6f3c] sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold leading-6 text-[#171713]">
          Teléfono
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="mt-2.5 block w-full rounded-md border-0 bg-white px-3.5 py-2 text-[#171713] shadow-sm ring-1 ring-inset ring-[#cfc4b4] placeholder:text-[#8a8276] focus:ring-2 focus:ring-inset focus:ring-[#bd6f3c] sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-[#171713]">
          Situación que necesitan ordenar
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-2.5 block w-full rounded-md border-0 bg-white px-3.5 py-2 text-[#171713] shadow-sm ring-1 ring-inset ring-[#cfc4b4] placeholder:text-[#8a8276] focus:ring-2 focus:ring-inset focus:ring-[#bd6f3c] sm:text-sm sm:leading-6"
        />
      </div>

      {result ? (
        <div className="rounded-[6px] border border-[#ded5c7] bg-[#f8f5ee] px-4 py-3 text-sm text-[#3f423a]">
          {result}
        </div>
      ) : null}

      <Button type="submit" size="lg" className="w-full gap-2 bg-[#bd6f3c] hover:bg-[#9f5528]" disabled={busy}>
        <Send className="h-4 w-4" />
        {busy ? "Enviando..." : "Solicitar diagnóstico"}
      </Button>
    </form>
  );
}
