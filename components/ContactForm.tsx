"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setResult(null);
        setBusy(true);
        try {
          const form = new FormData(e.currentTarget);
          const payload = {
            source: "contact",
            name: String(form.get("name") ?? ""),
            email: String(form.get("email") ?? ""),
            message: String(form.get("message") ?? ""),
            page: "/contacto",
          };
          const r = await fetch("/api/leads", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          });
          const json = (await r.json()) as { ok?: boolean; error?: string };
          if (!json.ok) {
            setResult(`Error: ${json.error}`);
            return;
          }
          setResult("¡Gracias! Recibimos tu mensaje.");
          (e.currentTarget as HTMLFormElement).reset();
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
          setResult(`Error: ${message}`);
        } finally {
          setBusy(false);
        }
      }}
    >
      <div>
        <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-2.5 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-2.5 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-2.5 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          defaultValue={""}
        />
      </div>

      {result ? <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">{result}</div> : null}

      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Enviando…" : "Enviar Mensaje"}
      </Button>
    </form>
  );
}
