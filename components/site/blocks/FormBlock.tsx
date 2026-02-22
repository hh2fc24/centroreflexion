"use client";

import { useMemo, useState } from "react";
import type { SiteBlock } from "@/lib/editor/types";
import { BlockShell } from "@/components/site/blocks/BlockShell";
import { EditableAtom } from "@/components/editor/EditableAtom";
import { usePages } from "@/lib/editor/hooks";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type FieldType = "text" | "email" | "tel" | "textarea" | "select" | "checkbox";

type FormField = {
  id: string;
  type: FieldType;
  label: string;
  key: string; // maps into lead name/email/phone/message when matches
  required: boolean;
  placeholder?: string;
  options?: string[];
};

type FormData = {
  title: string;
  subtitle: string;
  submitLabel: string;
  successMessage: string;
  fields: FormField[];
};

export function FormBlock({ pageId, block, editable }: { pageId: string; block: SiteBlock; editable: boolean }) {
  const { updateBlockData } = usePages();
  const pathname = usePathname();
  const data = (block.data ?? {}) as Partial<FormData>;

  const d: FormData = {
    title: data.title ?? "Formulario",
    subtitle: data.subtitle ?? "Cuéntanos qué necesitas y te contactamos.",
    submitLabel: data.submitLabel ?? "Enviar",
    successMessage: data.successMessage ?? "¡Listo! Te respondemos pronto.",
    fields: Array.isArray(data.fields) ? (data.fields as FormField[]) : [],
  };

  const commit = (partial: Partial<FormData>) => updateBlockData(pageId, block.id, { ...d, ...partial });

  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});

  const visibleFields = useMemo(() => d.fields.filter(Boolean), [d.fields]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editable) return;
    setBusy(true);
    setErr(null);
    setOk(false);
    try {
      const payload: Record<string, unknown> = {
        source: "form",
        page: pathname || "",
        formId: block.id,
        fields: values,
      };

      // Compatibility with existing leads schema
      const v = values as Record<string, unknown>;
      const pick = (k: string) => (typeof v[k] === "string" ? String(v[k]) : "");
      payload.name = pick("name");
      payload.email = pick("email");
      payload.phone = pick("phone");
      payload.message = pick("message");

      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await r.json();
      if (!json.ok) throw new Error(json.error || "submit_failed");
      setOk(true);
      setValues({});
    } catch (e2: unknown) {
      const message = e2 instanceof Error ? e2.message : typeof e2 === "string" ? e2 : JSON.stringify(e2);
      setErr(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <BlockShell block={block}>
      <div className={cn("rounded-3xl border p-6 sm:p-8", block.preset === "bold" ? "border-white/10 bg-slate-950 text-white" : "border-black/10 bg-white")}>
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-semibold tracking-tight font-serif">
            <EditableAtom value={d.title} ariaLabel="Form title" onCommit={(v) => commit({ title: v })} />
          </div>
          <div className={cn("text-sm", block.preset === "bold" ? "text-white/75" : "text-slate-600")}>
            <EditableAtom value={d.subtitle} ariaLabel="Form subtitle" multiline onCommit={(v) => commit({ subtitle: v })} />
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {visibleFields.map((f) => {
            const key = (f.key || f.id || "").trim() || f.id;
            const common = {
              required: !!f.required,
              placeholder: f.placeholder ?? "",
              value: (typeof values[key] === "string" ? (values[key] as string) : "") as string,
              onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
                setValues((cur) => ({ ...cur, [key]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value })),
              className: cn(
                "mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition",
                block.preset === "bold"
                  ? "border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-white/25"
                  : "border-black/10 bg-white text-slate-950 placeholder:text-slate-400 focus:border-black/20"
              ),
            };

            return (
              <label key={f.id} className="block text-xs font-semibold text-white/70">
                <div className={cn("text-xs font-semibold", block.preset === "bold" ? "text-white/80" : "text-slate-700")}>
                  {f.label || "Campo"} {f.required ? <span className="text-red-500">*</span> : null}
                </div>

                {f.type === "textarea" ? (
                  <textarea {...common} rows={4} />
                ) : f.type === "select" ? (
                  <select {...common}>
                    <option value="">Selecciona…</option>
                    {(f.options ?? []).map((opt, idx) => (
                      <option key={`${f.id}-opt-${idx}`} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : f.type === "checkbox" ? (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!values[key]}
                      onChange={(e) => setValues((cur) => ({ ...cur, [key]: e.target.checked }))}
                      className="h-4 w-4"
                    />
                    <div className={cn("text-sm font-medium", block.preset === "bold" ? "text-white/80" : "text-slate-700")}>
                      {f.placeholder || "Sí"}
                    </div>
                  </div>
                ) : (
                  <input {...common} type={f.type} />
                )}
              </label>
            );
          })}

          {ok ? (
            <div className={cn("rounded-2xl border px-4 py-3 text-sm", block.preset === "bold" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-100" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-900")}>
              <EditableAtom value={d.successMessage} ariaLabel="Form success message" multiline onCommit={(v) => commit({ successMessage: v })} />
            </div>
          ) : null}

          {err ? (
            <div className={cn("text-xs", block.preset === "bold" ? "text-red-200" : "text-red-700")}>Error: {err}</div>
          ) : null}

          <button
            type="submit"
            disabled={busy || editable}
            className={cn(
              "w-full rounded-full px-6 py-3 text-sm font-semibold transition",
              busy || editable ? "opacity-70" : "",
              block.preset === "bold" ? "bg-white text-slate-950 hover:bg-white/90" : "bg-slate-950 text-white hover:bg-slate-900"
            )}
          >
            {busy ? "Enviando…" : <EditableAtom value={d.submitLabel} ariaLabel="Form submit label" onCommit={(v) => commit({ submitLabel: v })} />}
          </button>
        </form>
      </div>
    </BlockShell>
  );
}

